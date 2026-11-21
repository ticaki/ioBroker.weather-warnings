/**
 * Admin template preview: renders a (possibly unsaved) template against the
 * currently active warnings, or against a sample warning if none is active.
 * Uses the very same renderer as the push services.
 */
import type { WeatherWarnings } from './WeatherWarnings';
import { MessagesClass } from './messages';
import { getPreviewSample } from './test-warnings';
import { finalizeTemplateText, renderTemplate, type TemplateData, type TemplateTable } from './templateRenderer';

/** One rendered preview. */
export interface TemplatePreviewResult {
    /** short description of the warning the preview is based on */
    label: string;
    /** true if the preview is based on sample data instead of a real warning */
    sample: boolean;
    /** the rendered text exactly as a push service would receive it */
    text: string;
}

/** Request sent by the admin template editor. */
export interface TemplatePreviewRequest {
    template: string;
    templateKey?: string;
    templateTable?: TemplateTable;
}

const MAX_PREVIEWS = 3;

/**
 * Renders the template of the request.
 *
 * @param adapter the adapter instance
 * @param request the preview request
 * @returns the rendered previews and the template errors that occurred while rendering
 */
export async function buildTemplatePreview(
    adapter: WeatherWarnings,
    request: TemplatePreviewRequest,
): Promise<{ results: TemplatePreviewResult[]; errors: string[] }> {
    const errors: string[] = [];
    const log = {
        error: (...message: string[]): void => {
            const text = message.join(' ');
            if (!errors.includes(text)) {
                errors.push(text);
            }
        },
    };
    const templates: TemplateTable = Array.isArray(request.templateTable)
        ? request.templateTable
        : adapter.config.templateTable;
    const templateKey = request.templateKey || 'preview';
    const template = typeof request.template === 'string' ? request.template : '';

    const sources: { label: string; sample: boolean; data: TemplateData }[] = [];
    const providers = adapter.providerController?.providers ?? [];
    for (const provider of providers) {
        for (const message of provider.messages) {
            if (sources.length >= MAX_PREVIEWS) {
                break;
            }
            if (!message.formatedData || message.name === 'noMessage') {
                continue;
            }
            sources.push({ label: describe(message.formatedData), sample: false, data: message.formatedData });
        }
    }

    if (sources.length === 0 && providers.length > 0 && adapter.providerController) {
        const provider = providers[0];
        const raw = getPreviewSample(provider.service);
        if (raw) {
            const message = new MessagesClass(adapter, 'preview', provider, raw, adapter.providerController);
            try {
                const data = await message.updateFormated();
                sources.push({ label: describe(data), sample: true, data });
            } catch (error) {
                errors.push(`Sample data could not be formatted: ${String(error)}`);
            } finally {
                await message.delete();
            }
        }
    }

    const results = sources.map(source => ({
        label: source.label,
        sample: source.sample,
        text: finalizeTemplateText(renderTemplate(template, templateKey, source.data, templates, log)),
    }));
    return { results, errors };
}

function describe(data: TemplateData): string {
    if (!data) {
        return '';
    }
    return [data.provider, data.locationcustom || data.location, data.headline]
        .filter(a => a !== undefined && a !== '')
        .join(' – ');
}

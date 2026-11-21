import React from 'react';
import { ConfigGeneric, type ConfigGenericProps, type ConfigGenericState } from '@iobroker/json-config';
import { I18n } from '@iobroker/gui-components';
import {
    Alert,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    IconButton,
    InputAdornment,
    LinearProgress,
    List,
    ListItemButton,
    ListItemText,
    Paper,
    Switch,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { Add, ContentCopy, Delete, Search } from '@mui/icons-material';
import {
    findTemplateUsages,
    groupTokens,
    parseTemplateHelp,
    renameTemplate,
    uniqueTemplateKey,
    validateTemplateKey,
    TOKEN_GROUPS,
    type TemplateRow,
    type TemplateUsage,
} from '../../src/lib/templateEditorModel';
import { SERVICE_NAMES } from './serviceNames';

interface PreviewResult {
    label: string;
    sample: boolean;
    text: string;
}

interface TemplateEditorState extends ConfigGenericState {
    selected: number;
    search: string;
    tokenSearch: string;
    /** text currently typed in the editor (committed to the config debounced) */
    draftText: string | null;
    /** key currently typed in the editor (committed on blur) */
    draftKey: string | null;
    preview: PreviewResult[];
    previewErrors: string[];
    previewLoading: boolean;
    previewFailed: boolean;
    prettyJson: boolean;
    deleteDialog: boolean;
}

const COMMIT_DELAY = 400;
const PREVIEW_DELAY = 500;

/**
 * Admin custom component replacing the plain template table: list + editor
 * with token palette and a live preview rendered by the adapter itself.
 */
class TemplateEditor extends ConfigGeneric<ConfigGenericProps, TemplateEditorState> {
    private textRef = React.createRef<HTMLTextAreaElement>();
    private commitTimer: ReturnType<typeof setTimeout> | undefined;
    private previewTimer: ReturnType<typeof setTimeout> | undefined;
    private previewRequest = 0;

    constructor(props: ConfigGenericProps) {
        super(props);
        this.state = {
            ...this.state,
            selected: 0,
            search: '',
            tokenSearch: '',
            draftText: null,
            draftKey: null,
            preview: [],
            previewErrors: [],
            previewLoading: false,
            previewFailed: false,
            prettyJson: true,
            deleteDialog: false,
        };
    }

    async componentDidMount(): Promise<void> {
        await super.componentDidMount();
        this.schedulePreview();
    }

    componentWillUnmount(): void {
        this.flushText(true);
        if (this.previewTimer) {
            clearTimeout(this.previewTimer);
        }
        super.componentWillUnmount?.();
    }

    componentDidUpdate(prevProps: ConfigGenericProps): void {
        // the table may be replaced from outside (restore/add defaults)
        if (prevProps.data.templateTable !== this.props.data.templateTable && this.state.draftText === null) {
            if (this.state.selected >= this.table().length) {
                this.setState({ selected: Math.max(0, this.table().length - 1) });
            }
        }
        if (prevProps.alive !== this.props.alive) {
            this.schedulePreview();
        }
    }

    /**
     * Translates without pattern evaluation - getText() would execute texts
     * containing `${…}` (our syntax help) as JavaScript template strings.
     *
     * @param key i18n key
     */
    private t(key: string): string {
        return I18n.t(key);
    }

    private table(): TemplateRow[] {
        const t = this.props.data.templateTable;
        return Array.isArray(t) ? (t as TemplateRow[]) : [];
    }

    private current(): TemplateRow | undefined {
        return this.table()[this.state.selected];
    }

    private currentText(): string {
        return this.state.draftText ?? this.current()?.template ?? '';
    }

    /**
     * writes the complete data object at once (several attributes may change)
     *
     * @param data
     */
    private writeData(data: Record<string, any>): void {
        this.props.onChange(data);
    }

    private writeTable(table: TemplateRow[]): void {
        this.writeData({ ...JSON.parse(JSON.stringify(this.props.data)), templateTable: table });
    }

    // ----- editing ---------------------------------------------------------

    private flushText(unmounting = false): void {
        if (this.commitTimer) {
            clearTimeout(this.commitTimer);
            this.commitTimer = undefined;
        }
        const draft = this.state.draftText;
        const row = this.current();
        if (draft === null || !row) {
            return;
        }
        if (draft !== row.template) {
            const table = this.table().map((r, i) => (i === this.state.selected ? { ...r, template: draft } : r));
            this.writeTable(table);
        }
        if (!unmounting) {
            this.setState({ draftText: null });
        }
    }

    private onTextChange(text: string): void {
        this.setState({ draftText: text }, () => this.schedulePreview());
        if (this.commitTimer) {
            clearTimeout(this.commitTimer);
        }
        this.commitTimer = setTimeout(() => this.flushText(), COMMIT_DELAY);
    }

    private commitKey(): void {
        const row = this.current();
        const draft = this.state.draftKey;
        this.setState({ draftKey: null });
        if (!row || draft === null) {
            return;
        }
        const newKey = draft.trim();
        if (newKey === row.templateKey) {
            return;
        }
        // reject invalid names, keep the old one
        const probe = this.table().map((r, i) => (i === this.state.selected ? { ...r, templateKey: newKey } : r));
        if (validateTemplateKey(probe, this.state.selected)) {
            return;
        }
        if (!row.templateKey) {
            this.writeTable(probe);
            return;
        }
        this.writeData(renameTemplate(this.props.data, row.templateKey, newKey));
    }

    private select(index: number): void {
        this.flushText();
        this.commitKey();
        this.setState({ selected: index, draftText: null, draftKey: null }, () => this.schedulePreview());
    }

    private addTemplate(copyOf?: TemplateRow): void {
        this.flushText();
        const table = this.table();
        const key = uniqueTemplateKey(table, copyOf ? `${copyOf.templateKey}_copy` : 'NewTemplate');
        const next = [...table, { templateKey: key, template: copyOf ? copyOf.template : '' }];
        this.writeTable(next);
        this.setState({ selected: next.length - 1, draftText: null, draftKey: null, search: '' }, () =>
            this.schedulePreview(),
        );
    }

    private deleteCurrent(): void {
        const table = this.table().filter((_r, i) => i !== this.state.selected);
        this.writeTable(table);
        this.setState(
            {
                deleteDialog: false,
                draftText: null,
                draftKey: null,
                selected: Math.max(0, Math.min(this.state.selected, table.length - 1)),
            },
            () => this.schedulePreview(),
        );
    }

    /**
     * inserts `${token}` at the cursor position of the template field
     *
     * @param token
     */
    private insertToken(token: string): void {
        const insert = `\${${token}}`;
        const text = this.currentText();
        const el = this.textRef.current;
        const start = el ? el.selectionStart : text.length;
        const end = el ? el.selectionEnd : text.length;
        const next = text.slice(0, start) + insert + text.slice(end);
        this.onTextChange(next);
        // restore the cursor behind the inserted token
        setTimeout(() => {
            if (this.textRef.current) {
                this.textRef.current.focus();
                const pos = start + insert.length;
                this.textRef.current.setSelectionRange(pos, pos);
            }
        }, 0);
    }

    // ----- preview ---------------------------------------------------------

    private schedulePreview(): void {
        if (this.previewTimer) {
            clearTimeout(this.previewTimer);
        }
        this.previewTimer = setTimeout(() => void this.loadPreview(), PREVIEW_DELAY);
    }

    private async loadPreview(): Promise<void> {
        const row = this.current();
        if (!row || !this.props.alive) {
            this.setState({ preview: [], previewErrors: [], previewLoading: false, previewFailed: false });
            return;
        }
        const request = ++this.previewRequest;
        const table = this.table().map((r, i) =>
            i === this.state.selected ? { ...r, template: this.currentText() } : r,
        );
        this.setState({ previewLoading: true });
        try {
            const oContext = this.props.oContext;
            const reply = await oContext.socket.sendTo(
                `${oContext.adapterName}.${oContext.instance}`,
                'templatePreview',
                {
                    template: this.currentText(),
                    templateKey: row.templateKey,
                    templateTable: table,
                },
            );
            if (request !== this.previewRequest) {
                return;
            }
            this.setState({
                preview: reply?.results ?? [],
                previewErrors: reply?.errors ?? [],
                previewLoading: false,
                previewFailed: !reply,
            });
        } catch {
            if (request === this.previewRequest) {
                this.setState({ preview: [], previewErrors: [], previewLoading: false, previewFailed: true });
            }
        }
    }

    private formatPreview(text: string): string {
        if (!this.state.prettyJson) {
            return text;
        }
        const trimmed = text.trim();
        if (!(trimmed.startsWith('{') || trimmed.startsWith('['))) {
            return text;
        }
        try {
            return JSON.stringify(JSON.parse(trimmed), null, 2);
        } catch {
            return text;
        }
    }

    // ----- rendering -------------------------------------------------------

    private usageLabel(u: TemplateUsage): string {
        if (u.service === 'template') {
            return `${this.t('tpl_used_in_template')} ${u.slot}`;
        }
        return `${SERVICE_NAMES[u.service] ?? u.service}: ${this.t(`tpl_slot_${u.slot}`)}`;
    }

    private renderList(): React.JSX.Element {
        const table = this.table();
        const search = this.state.search.toLowerCase();
        return (
            <Paper
                variant="outlined"
                sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}
            >
                <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
                    <TextField
                        size="small"
                        fullWidth
                        placeholder={this.t('tpl_search')}
                        value={this.state.search}
                        onChange={e => this.setState({ search: e.target.value })}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search fontSize="small" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <Tooltip title={this.t('tpl_new')}>
                        <IconButton
                            color="primary"
                            onClick={() => this.addTemplate()}
                        >
                            <Add />
                        </IconButton>
                    </Tooltip>
                </Box>
                <List
                    dense
                    sx={{ overflowY: 'auto', maxHeight: 600 }}
                >
                    {table.length === 0 && (
                        <Typography
                            sx={{ px: 2, py: 1 }}
                            color="text.secondary"
                        >
                            {this.t('tpl_empty')}
                        </Typography>
                    )}
                    {table.map((row, index) => {
                        if (
                            search &&
                            !row.templateKey.toLowerCase().includes(search) &&
                            !(row.template || '').toLowerCase().includes(search)
                        ) {
                            return null;
                        }
                        const error = validateTemplateKey(table, index);
                        const used = findTemplateUsages(this.props.data, row.templateKey).length;
                        return (
                            <ListItemButton
                                key={index}
                                selected={index === this.state.selected}
                                onClick={() => this.select(index)}
                            >
                                <ListItemText
                                    primary={row.templateKey || this.t('tpl_unnamed')}
                                    secondary={(row.template || '').slice(0, 60)}
                                    slotProps={{
                                        primary: { color: error ? 'error' : undefined, noWrap: true },
                                        secondary: { noWrap: true, sx: { fontFamily: 'monospace' } },
                                    }}
                                />
                                {used > 0 && (
                                    <Chip
                                        size="small"
                                        label={used}
                                        sx={{ ml: 1 }}
                                    />
                                )}
                            </ListItemButton>
                        );
                    })}
                </List>
            </Paper>
        );
    }

    private renderTokens(): React.JSX.Element {
        const help = parseTemplateHelp(this.props.data.templateHelp);
        const tokens = Object.keys(help).length ? Object.keys(help) : TOKEN_GROUPS.flatMap(g => g.tokens);
        const filter = this.state.tokenSearch.toLowerCase();
        const match = (token: string): boolean =>
            !filter || token.toLowerCase().includes(filter) || (help[token] || '').toLowerCase().includes(filter);
        const groups = groupTokens(tokens)
            .map(g => ({ ...g, tokens: g.tokens.filter(match) }))
            .filter(g => g.tokens.length);
        const current = this.current()?.templateKey;
        const templates = this.table()
            .map(r => r.templateKey)
            .filter(k => k && k !== current && match(k));

        return (
            <Box>
                <TextField
                    size="small"
                    fullWidth
                    placeholder={this.t('tpl_token_search')}
                    value={this.state.tokenSearch}
                    onChange={e => this.setState({ tokenSearch: e.target.value })}
                    sx={{ mb: 1 }}
                />
                <Box>
                    {groups.map(group => (
                        <Box
                            key={group.id}
                            sx={{ mb: 1 }}
                        >
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                {this.t(`tpl_group_${group.id}`)}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {group.tokens.map(token => (
                                    <Tooltip
                                        key={token}
                                        title={help[token] || token}
                                    >
                                        <Chip
                                            size="small"
                                            variant="outlined"
                                            label={token}
                                            onClick={() => this.insertToken(token)}
                                        />
                                    </Tooltip>
                                ))}
                            </Box>
                        </Box>
                    ))}
                    {templates.length > 0 && (
                        <Box sx={{ mb: 1 }}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                {this.t('tpl_group_templates')}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {templates.map(key => (
                                    <Chip
                                        key={key}
                                        size="small"
                                        color="secondary"
                                        variant="outlined"
                                        label={key}
                                        onClick={() => this.insertToken(key)}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
        );
    }

    private renderPreview(): React.JSX.Element {
        if (!this.props.alive) {
            return <Alert severity="info">{this.t('tpl_preview_offline')}</Alert>;
        }
        return (
            <Box>
                {this.state.previewLoading ? <LinearProgress sx={{ mb: 1 }} /> : <Box sx={{ height: 4, mb: 1 }} />}
                {this.state.previewFailed && <Alert severity="warning">{this.t('tpl_preview_failed')}</Alert>}
                {this.state.previewErrors.length > 0 && (
                    <Alert
                        severity="error"
                        sx={{ mb: 1 }}
                    >
                        <strong>{this.t('tpl_preview_errors')}</strong>
                        {this.state.previewErrors.map((e, i) => (
                            <div key={i}>{e}</div>
                        ))}
                    </Alert>
                )}
                {!this.state.previewFailed && !this.state.previewLoading && this.state.preview.length === 0 && (
                    <Typography color="text.secondary">{this.t('tpl_preview_none')}</Typography>
                )}
                {this.state.preview.map((p, i) => (
                    <Paper
                        key={i}
                        variant="outlined"
                        sx={{ p: 1, mb: 1 }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ flex: 1 }}
                                noWrap
                            >
                                {p.label}
                            </Typography>
                            {p.sample && (
                                <Chip
                                    size="small"
                                    color="warning"
                                    label={this.t('tpl_preview_sample')}
                                />
                            )}
                        </Box>
                        <Box
                            component="pre"
                            sx={{
                                m: 0,
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                fontFamily: 'monospace',
                                fontSize: '0.85rem',
                            }}
                        >
                            {this.formatPreview(p.text) || ' '}
                        </Box>
                    </Paper>
                ))}
            </Box>
        );
    }

    private renderEditor(): React.JSX.Element {
        const row = this.current();
        if (!row) {
            return (
                <Paper
                    variant="outlined"
                    sx={{ p: 2 }}
                >
                    <Typography color="text.secondary">{this.t('tpl_select')}</Typography>
                </Paper>
            );
        }
        const table = this.table();
        const keyValue = this.state.draftKey ?? row.templateKey;
        const probe = table.map((r, i) => (i === this.state.selected ? { ...r, templateKey: keyValue.trim() } : r));
        const keyError = validateTemplateKey(probe, this.state.selected);
        const usages = findTemplateUsages(this.props.data, row.templateKey);

        return (
            <Paper
                variant="outlined"
                sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
            >
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <TextField
                        size="small"
                        label={this.t('tpl_key')}
                        value={keyValue}
                        error={!!keyError}
                        helperText={keyError ? this.t(keyError) : this.t('tpl_key_rename_hint')}
                        onChange={e => this.setState({ draftKey: e.target.value })}
                        onBlur={() => this.commitKey()}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                this.commitKey();
                            }
                        }}
                        sx={{ flex: 1 }}
                    />
                    <Tooltip title={this.t('tpl_duplicate')}>
                        <IconButton onClick={() => this.addTemplate({ ...row, template: this.currentText() })}>
                            <ContentCopy />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={this.t('tpl_delete')}>
                        <IconButton
                            color="error"
                            onClick={() => this.setState({ deleteDialog: true })}
                        >
                            <Delete />
                        </IconButton>
                    </Tooltip>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mr: 1 }}
                    >
                        {this.t('tpl_used_by')}
                    </Typography>
                    {usages.length === 0 ? (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {this.t('tpl_unused')}
                        </Typography>
                    ) : (
                        usages.map((u, i) => (
                            <Chip
                                key={i}
                                size="small"
                                label={this.usageLabel(u)}
                            />
                        ))
                    )}
                </Box>

                <TextField
                    label={this.t('tpl_text')}
                    multiline
                    minRows={4}
                    maxRows={20}
                    fullWidth
                    value={this.currentText()}
                    onChange={e => this.onTextChange(e.target.value)}
                    onBlur={() => this.flushText()}
                    helperText={this.t('tpl_text_help')}
                    inputRef={this.textRef}
                    slotProps={{ htmlInput: { style: { fontFamily: 'monospace' }, spellCheck: false } }}
                />

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
                        gap: 2,
                    }}
                >
                    <Box>
                        <Typography
                            variant="subtitle2"
                            sx={{ mb: 1 }}
                        >
                            {this.t('tpl_insert_token')}
                        </Typography>
                        {this.renderTokens()}
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            component="div"
                            sx={{ mt: 1, whiteSpace: 'pre-line' }}
                        >
                            {this.t('tpl_syntax_help')}
                        </Typography>
                    </Box>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography
                                variant="subtitle2"
                                sx={{ flex: 1 }}
                            >
                                {this.t('tpl_preview')}
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Switch
                                        size="small"
                                        checked={this.state.prettyJson}
                                        onChange={e => this.setState({ prettyJson: e.target.checked })}
                                    />
                                }
                                label={<Typography variant="caption">{this.t('tpl_preview_json')}</Typography>}
                            />
                        </Box>
                        {this.renderPreview()}
                    </Box>
                </Box>
            </Paper>
        );
    }

    private renderDeleteDialog(): React.JSX.Element | null {
        const row = this.current();
        if (!this.state.deleteDialog || !row) {
            return null;
        }
        const usages = findTemplateUsages(this.props.data, row.templateKey);
        return (
            <Dialog
                open
                onClose={() => this.setState({ deleteDialog: false })}
            >
                <DialogTitle>{this.t('tpl_delete_confirm').replace('%s', row.templateKey)}</DialogTitle>
                <DialogContent>
                    {usages.length > 0 ? (
                        <Alert severity="warning">
                            {this.t('tpl_delete_used')}
                            <ul style={{ margin: 0 }}>
                                {usages.map((u, i) => (
                                    <li key={i}>{this.usageLabel(u)}</li>
                                ))}
                            </ul>
                        </Alert>
                    ) : (
                        <Typography>{this.t('tpl_delete_unused')}</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.setState({ deleteDialog: false })}>{this.t('tpl_cancel')}</Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={() => this.deleteCurrent()}
                    >
                        {this.t('tpl_delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    render(): React.JSX.Element {
        return (
            <Box
                sx={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'minmax(220px, 1fr) 3fr' },
                    gap: 2,
                    alignItems: 'start',
                }}
            >
                {this.renderList()}
                {this.renderEditor()}
                {this.renderDeleteDialog()}
            </Box>
        );
    }
}

export default TemplateEditor;

import React from 'react';
import {
    ConfigGeneric,
    JsonConfigComponent,
    type ConfigGenericProps,
    type ConfigGenericState,
} from '@iobroker/json-config';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import {
    SERVICE_TYPES,
    modelEntryToFlat,
    flatEntryToModel,
    type ServiceType,
    type NotificationServicesConfig,
} from '../../src/lib/notificationServicesModel';
import { buildServiceSchema } from './serviceSchema';

interface NotificationServicesState extends ConfigGenericState {
    activeService: ServiceType | null;
}

/**
 * Admin custom component that replaces the nine duplicated notification-service
 * tabs. The shared field set is generated once (see {@link buildServiceSchema})
 * and rendered per service through an embedded {@link JsonConfigComponent}, so
 * all existing `selectSendTo` backend handlers keep working. Values are stored
 * in the structured `config.notificationServices` object.
 */
class NotificationServicesTab extends ConfigGeneric<ConfigGenericProps, NotificationServicesState> {
    /** flat working copy fed into the embedded JsonConfigComponent */
    private workingData: Record<string, any> = {};

    constructor(props: ConfigGenericProps) {
        super(props);
        this.state = {
            ...this.state,
            activeService: null,
        };
    }

    async componentDidMount(): Promise<void> {
        await super.componentDidMount();
        this.workingData = this.buildWorkingData();
        const enabled = this.enabledServices();
        this.setState({ activeService: enabled[0] ?? null });
    }

    /** Services whose master toggle (in the basic config) is enabled. */
    private enabledServices(): ServiceType[] {
        const data = this.props.data;
        return SERVICE_TYPES.filter(s => !!data[`${s}_Enabled`]);
    }

    /**
     * Builds the flat working copy for the embedded JsonConfigComponent.
     * Prefers the structured model and falls back to the legacy flat keys so
     * the admin never crashes before the one-time backend migration ran.
     */
    private buildWorkingData(): Record<string, any> {
        const data = this.props.data;
        const model = data.notificationServices as NotificationServicesConfig | undefined;
        const flat: Record<string, any> = {};
        for (const service of SERVICE_TYPES) {
            const entry = model?.[service];
            if (entry) {
                Object.assign(flat, modelEntryToFlat(service, entry));
            } else {
                for (const key of Object.keys(data)) {
                    if (key.startsWith(`${service}_`) && key !== `${service}_Enabled`) {
                        flat[key] = data[key];
                    }
                }
            }
        }
        // context fields used by hidden/disabled/validator expressions
        flat.templateTable = data.templateTable;
        flat.dwdEnabled = data.dwdEnabled;
        flat.uwzEnabled = data.uwzEnabled;
        flat.zamgEnabled = data.zamgEnabled;
        flat.imExpert = data.imExpert;
        return flat;
    }

    /**
     * Converts the flat working copy back into the structured model.
     *
     * @param flat
     */
    private buildModel(flat: Record<string, any>): NotificationServicesConfig {
        const model: NotificationServicesConfig = {};
        for (const service of SERVICE_TYPES) {
            model[service] = flatEntryToModel(service, flat);
        }
        return model;
    }

    private onServiceDataChange = (newData: Record<string, any>): void => {
        this.workingData = newData;
        void this.onChange('notificationServices', this.buildModel(newData));
    };

    render(): React.JSX.Element {
        const oContext = this.props.oContext;
        const enabled = this.enabledServices();

        if (!enabled.length) {
            return (
                <Box sx={{ p: 2 }}>
                    <Typography color="text.secondary">{this.getText('noNotificationServiceEnabled')}</Typography>
                </Box>
            );
        }

        const active =
            this.state.activeService && enabled.includes(this.state.activeService)
                ? this.state.activeService
                : enabled[0];

        return (
            <Box sx={{ width: '100%' }}>
                <Tabs
                    value={active}
                    onChange={(_e, value: ServiceType) => this.setState({ activeService: value })}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {enabled.map(service => (
                        <Tab
                            key={service}
                            value={service}
                            label={this.getText(service)}
                        />
                    ))}
                </Tabs>
                <Box sx={{ mt: 1 }}>
                    <JsonConfigComponent
                        key={active}
                        socket={oContext.socket}
                        themeName={oContext._themeName}
                        themeType={oContext.themeType}
                        theme={oContext.theme}
                        adapterName={oContext.adapterName}
                        instance={oContext.instance}
                        isFloatComma={oContext.isFloatComma}
                        dateFormat={oContext.dateFormat}
                        schema={buildServiceSchema(active) as any}
                        data={this.workingData}
                        onError={() => {}}
                        onChange={this.onServiceDataChange}
                    />
                </Box>
            </Box>
        );
    }
}

export default NotificationServicesTab;

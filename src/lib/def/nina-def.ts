/** NINA sub sources (`payload.data.provider` of a dashboard entry, upper case). */
export const ninaSources = ['MOWAS', 'KATWARN', 'BIWAPP', 'POLICE', 'DWD', 'LHP'] as const;
export type ninaSourceType = (typeof ninaSources)[number];
/** sources that are active when the user did not choose any (DWD is its own provider, LHP is too local) */
export const ninaDefaultSources: ninaSourceType[] = ['MOWAS', 'KATWARN', 'BIWAPP', 'POLICE'];

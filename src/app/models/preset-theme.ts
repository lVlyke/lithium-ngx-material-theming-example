export enum PresetTheme {
    Default = 'default',
    Dark = 'dark'
}

export namespace PresetTheme {

    export interface Profile {
        primary: string;
        accent: string;
        warn: string;
    }

    export const profiles: { [themeName: string]: Profile } = {
        default: {
            primary: '#2196f3',
            accent: '#ff4081',
            warn: '#f44336'
        },
        dark: {
            primary: '#4caf50',
            accent: '#2196f3',
            warn: '#f44336'
        }
    };

    export const values: Readonly<PresetTheme[]> = [
        PresetTheme.Default,
        PresetTheme.Dark
    ];
}

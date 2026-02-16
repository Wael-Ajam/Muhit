import { SettingsService } from './settings.service';
export declare class SettingsController {
    private settingsService;
    constructor(settingsService: SettingsService);
    getAll(): Promise<Record<string, string>>;
    update(body: {
        settings: {
            key: string;
            value: string;
        }[];
    }): Promise<Record<string, string>>;
}

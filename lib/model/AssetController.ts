export class AssetController {
    // A map of asset types, where the key is the asset type and the value is the list of assets for that type
    private assets: Map<string, any[]> = new Map();

    // Add an asset to the controller
    public addAsset(type: string, asset: any): void {
        // If the asset type does not yet exist in the map, create an empty array for it
        if (!this.assets.has(type)) {
            this.assets.set(type, []);
        }

        // Add the asset to the list of assets for the specified type
        this.assets.get(type).push(asset);
    }

    // Get all assets of a specific type
    public getAssets(type: string): any[] {
        return this.assets.get(type) || [];
    }
}

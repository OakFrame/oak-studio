export class ClusterMap {

    cluster_name: string;
    daemon_uris: string[];

    constructor() {
        this.cluster_name = "unnamed cluster";
        this.daemon_uris = [];
    }

    getMessagingURI() {

    }

    addDaemonToCluster(uri: string) {
        this.daemon_uris.push(uri);
    }

    getDaemons() {
        return this.daemon_uris;
    }

}

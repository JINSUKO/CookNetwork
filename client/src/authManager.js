class AuthManager {

    constructor() {
        this.queue = [];
        this.isProcessing = false;
    }

    static getInstance() {
        if (!AuthManager.instance) {
            AuthManager.instance = new AuthManager();
        }

        return AuthManager.instance;
    }

    async addRequest(requestFunc) {
        return new Promise((resolve, reject) => {
            this.queue.push({ requestFunc, resolve, reject });
            if (!this.isProcessing) {
                this.processQueue();
            }
        });
    }

    async processQueue() {
        if (!this.queue.length) {
            this.isProcessing = false;
            return
        }

        this.isProcessing = true;
        const { requestFunc, resolve, reject } = this.queue.shift();

        try {
            const response = await requestFunc();
            resolve(response);
        } catch (e) {
            reject(e);
        } finally {
            await this.processQueue();
        }

    }

}

const authManager = AuthManager.getInstance();

export default authManager;
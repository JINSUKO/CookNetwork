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

            // 로그인 검증 요청이 성공했을 때만, 로그인 검증이 필요한 다음 요청을 수행하게 한다.
            await this.processQueue();

        } catch (e) {
            // 로그인 검증이 잘못되면, 로그인 검증이 필요한 다음 요청을 또 수행할 이유가 없는 것 같아서 작업 큐를 바로 비워주는 것으로 변경했다.
            this.queue = [];
            this.isProcessing = false;

            reject(e);
        }

    }

}

const authManager = AuthManager.getInstance();

export default authManager;
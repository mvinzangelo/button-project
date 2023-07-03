import http from "../http-common";

class ButtonPressDataService {
    create(data) {
        return http.post("/button-presses", data);
    }
};

export default new ButtonPressDataService();
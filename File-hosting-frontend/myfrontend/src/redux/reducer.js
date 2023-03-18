const INITIAL_STATE = {
    userid: 0,
};

const customReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "SET_ID":
            return {
                ...state,
                userid: action.userid,
            };
        default:
            return state;
    }
};

export default customReducer;
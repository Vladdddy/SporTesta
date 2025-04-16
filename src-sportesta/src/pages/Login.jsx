import React from "react";

const Login = () => {
    return (
        <div
            style={{
                marginTop: "16vh",
            }}
            class="modal modal-sheet position-static d-block p-4 py-md-5"
            tabindex="-1"
            role="dialog"
            id="modalSignin"
        >
            <div class="modal-dialog">
                <div class="modal-content rounded-4 shadow">
                    <div class="modal-header p-5 pb-4 border-bottom-0">
                        <h1 class="fw-bold mb-0 fs-2">Login</h1>
                    </div>

                    <div class="modal-body p-5 pt-0">
                        <form class="">
                            <div class="form-floating mb-3">
                                <input
                                    type="text"
                                    class="form-control rounded-3"
                                    id="email"
                                    placeholder="name@example.com"
                                    required
                                ></input>
                                <label for="floatingInput">Username</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input
                                    type="password"
                                    class="form-control rounded-3"
                                    id="password"
                                    placeholder="Password"
                                    required
                                ></input>
                                <label for="floatingPassword">Password</label>
                            </div>
                            <button
                                class="w-100 mb-2 btn btn-lg rounded-3 btn-primary"
                                type="submit"
                            >
                                Accedi
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

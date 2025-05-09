const Register = () => {
    return (
        <div>
            <form>
                <h3>Register</h3>
                <div>
                    <label>Name</label>
                    <input type="text" />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" />
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input type="password" />
                </div>
            </form>
        </div>
    );
};

export default Register;

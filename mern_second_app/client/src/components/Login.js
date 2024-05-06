import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "./mix.css";

const Login = () => {
	const [inpval, setInpval] = useState({
		email: "",
	});

	const history = useNavigate();

	const setVal = (e) => {
		// console.log(e.target.value);
		const { name, value } = e.target;

		setInpval(() => {
			return {
				...inpval,
				[name]: value,
			};
		});
	};

	const loginuser = async (e) => {
		e.preventDefault();

		const { email } = inpval;

		if (email === "") {
			toast.error("email is required!", {
				position: "top-center",
			});
		} else if (!email.includes("@")) {
			toast.warning("includes @ in your email!", {
				position: "top-center",
			});
		} else {
			// console.log("user login succesfully done");
			console.log(email);
			const data = await fetch("/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
				}),
			});

			const res = await data.json();
			console.log(res);

			if (res.status === 200) {
				localStorage.setItem("usersdatatoken", res.result.token);
				history("/dash");
				setInpval({ ...inpval, email: "" });
			} else {
				history("/completelogin");
				setInpval({ ...inpval, email: "" });
			}
		}
	};

	return (
		<>
			<section>
				<div className="form_data">
					<div className="form_heading">
						<h1>Welcome Back, Log In</h1>
						<p>Hi, we are you glad you are back. Please login.</p>
					</div>

					<form>
						<div className="form_input">
							<label htmlFor="email">Email</label>
							<input
								type="email"
								value={inpval.email}
								onChange={setVal}
								name="email"
								id="email"
								placeholder="Enter Your Email Address"
							/>
						</div>

						<button className="btn" onClick={loginuser}>
							Login
						</button>
						<p>
							Don't have an Account? <NavLink to="/register">Sign Up</NavLink>{" "}
						</p>
					</form>
					<ToastContainer />
				</div>
			</section>
		</>
	);
};

export default Login;

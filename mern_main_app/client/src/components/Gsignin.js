import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

import { NavLink, useNavigate } from "react-router-dom";

const clientId =
	"817241561935-2fi0dt4qo35gmrm93pcirvokedp1u2hs.apps.googleusercontent.com";

const SignIn = () => {
	const history = useNavigate();

	const onSuccess = async (response) => {
		console.log("Login Success: ", response);

		try {
			const data = await fetch("/glogin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					Gresponse: response,
				}),
			});

			const res = await data.json();
			if (res.status === 201) {
				console.log(res);
				localStorage.setItem("usersdatatoken", res.result.token);
				history("/dash");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const onError = (error) => {
		console.error("Login Failed", error);
	};

	return (
		<div>
			<GoogleOAuthProvider clientId={clientId}>
				<GoogleLogin
					onSuccess={onSuccess}
					onError={onError}
					scope="profile email"
					auto_promt="false"
					theme="dark"
				/>
			</GoogleOAuthProvider>
		</div>
	);
};

export default SignIn;

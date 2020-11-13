
export default (err) => {  
	if(err.status === 401) {
		window.location.replace("/welcome");
	} else {
		console.log(err)
	}
};
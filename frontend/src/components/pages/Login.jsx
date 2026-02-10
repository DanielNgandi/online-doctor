import { useState } from "react"
import {Link, useNavigate} from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import API from "../../Api";
function Login() {
  const { login } = useAuth();
  const [formData,setFormData]=useState({
    email:'',
    password:''
  })
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange=e=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  };
    const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // const res = await fetch("http://localhost:5000/api/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });

      // const data = await res.json();

      // if (res.ok) {
      //   login(data.user, data.token);
      const res = await API.post("/api/auth/login", formData); // use API helper
      const data = res.data;

      // Save login state
      login(data.user, data.token);
        

        alert("Login successful!");
        console.log("User:", data.user);

        if (data.user.role.toLowerCase() === "admin") {
          navigate("/admin/appointments");
        } else if (data.user.role === "doctor") {
          navigate("/home");
        } else {
          navigate("/home"); // patient or default home
        }
      // } else {
      //   alert(data.message || "Login failed");
      // }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="px-5 lg:px-0">
      <div className="w-full max-w-[400px] mx-auto rounded-lg shadow-lg p-8 bg-white">
        <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-6">
          Hello! <span className="text-primaryColor">welcome</span> back
        </h3>
        <form onSubmit={submitHandler}className="py-4">
          <div className="mb-4">
            <input
              type="email"
              placeholder="enter your email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-solid border-gray-300 focus:outline-none focus:border-primaryColor text-[18px] leading-6 text-headingColor placeholder:text-textColor rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="enter your password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-solid border-gray-300 focus:outline-none focus:border-primaryColor text-[18px] leading-6 text-headingColor placeholder:text-textColor rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-2 shadow-md hover:bg-primaryColor-dark transition duration-300"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
          <p className="mt-4 text-textColor text-center">
            Dont have an account?{" "}
            <Link to="/register" className="text-primaryColor font-medium ml-1">
              Register
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
  

 
}

export default Login



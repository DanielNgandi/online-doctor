import { useState } from "react"
import {Link, useNavigate} from 'react-router-dom'

function Login() {
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
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ save token in localStorage for authenticated requests
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Login successful!");
        console.log("User:", data.user);

        if (data.user.role.toLowerCase() === "admin") {
          navigate("/add-doctor");
        } else if (data.user.role === "doctor") {
          navigate("/home");
        } else {
          navigate("/home"); // patient or default home
        }
      } else {
        alert(data.message || "Login failed");
      }
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
  

























  // return (
  //   <section className="px-5 lg:px-0">
  //     <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
  //       <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">Hello! <span className='text-primaryColor'>welcome</span> back</h3>
  //       <form action="" className="py-4 md:py-0">
  //         <div className="mb-5">
  //           <input type='email' placeholder='enter your email' name='email'  value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer" required/>
  //         </div>
  //         <div className="mb-5">
  //           <input type='password' placeholder='enter your password' name='password'  value={formData.password} onChange={handleInputChange} className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer" required/>
  //         </div>
  //         <div className="mt-7">
  //           <button type='submit' className="w-[10rem] bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-4">Login</button>
  //         </div>

  //         <p className="mt-5 text-textColor text-center">Dont have an account? <Link to='/register' className="text-primaryColor font-medium ml-1">Register</Link></p>
  //       </form>
  //     </div>

  //   </section>
  // )
}

export default Login























// const Login = () => {
//   return (
//     <div className="max-w-[500px] mt-[30px] mx-auto bg-[#1943832c] rounded-md flex items-center flex-col p-5 ml-96 ">
//       <div className="container flex flex-col p-4 items-center">
//         <label htmlFor="username" className="p-4 text-[18px] gap-4 flex">
//           Username
//           <input type="text" id="username" placeholder="Enter username" className="p-2 border rounded-md" />
//         </label>
//         <label htmlFor="password" className="p-4 text-[18px] gap-4 flex">
//           Password
//           <input type="password" id="password" placeholder="Enter password" className="p-2 border rounded-md" />
//         </label>
//         <button className="mt-4 p-2 bg-blue-500 text-white rounded-md">Login</button>
//       </div>
//     </div>
//   );
// };

// export default Login;

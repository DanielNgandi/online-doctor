import signupImg from '../../assets/images/signup.svg'
import avatar from '../../assets/images/avatar-icon.png'
import {Link} from 'react-router-dom'
import { useState } from 'react'
import API from '../../Api'

function Signup() {
  const [selectedFile,setSelectedFile]=useState(null)
  const [previewURL,setpreviewURL]=useState('')
  const [formData,setFormData]=useState({
    username:'',
    email:'',
    password:'',
    photo:selectedFile,
    gender:'',
    role:'patient'

  })
  const handleInputChange=e=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }
  const handleFileinput=(e)=>{
    const file=(e.target.files[0])
    //later we will use cloudinary to upload images
    console.log(file)
  }
  const submitHandler=async (event)=>{
    event.preventDefault()
    
//   try {
//     const res = await fetch("http://localhost:5000/api/auth/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(formData),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       alert("Signup successful!");
//       console.log(data);
//     } else {
//       alert(data.message || "Signup failed");
//     }
//   } catch (err) {
//     console.error(err);
//     alert("Server error");
//   }
// };

try {
      const payload = new FormData();
      payload.append('username', formData.username);
      payload.append('email', formData.email);
      payload.append('password', formData.password);
      payload.append('role', formData.role);
      payload.append('gender', formData.gender);
      if (formData.photo) {
        payload.append('photo', formData.photo); // for future file upload
      }

      const res = await API.post('/api/auth/register', payload, {
        headers: {
          'Content-Type': 'multipart/form-data', // required for file uploads
        },
      });

      alert('Signup successful!');
      console.log(res.data);
      navigate('/login'); // redirect to login after signup
    } catch (err) {
      console.error('Signup error:', err);
      alert(err.response?.data?.message || 'Signup failed or server error');
    } finally {
      setLoading(false);
    }
  };


  return (
    <section className="px-5 xl:px-0">
      <div className="max-w-[1170px] mx-auto shadow-lg rounded-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* image box */}
          <div className="hidden lg:block bg-primaryColor  rounded-l-lg">
            <figure className="rounded-l-lg">
              <img src={signupImg} alt="" className="w-full rounded-l-lg" />
            </figure>
          </div>
          <div className="rounded-l-lg lg:pl-16 py-10">
            <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
              Create an <span className="text-primaryColor">account</span>
            </h3>
            <form action="" 
            onSubmit={submitHandler} className="ml-10">
              <div className="mb-5">
                <input
                  type="text"
                  placeholder="Full Name"
                  name="username"
                  autoComplete='on'
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full max-w-[400px] pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer"
                  required
                />
              </div>
              <div className="mb-5">
                <input
                  type="email"
                  placeholder="Enter your email"
                  autoComplete='on'
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full max-w-[400px] pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer"
                  required
                />
              </div>
              <div className="mb-5">
                <input
                  type="password"
                  placeholder="Enter your password"
                  autoComplete='on'
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
          
                  className="w-full max-w-[400px] pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer"
                  required
                />
              </div>
              <div className="mb-5 flex items-center justify-between">
                <label htmlFor="role" className="text-headingColor font-bold text-[16px]">
                  Are you a:
                  <select
                    name="role"
                    id="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="text-textColor font-semibold text-[15px] leading-7 py-3 focus:outline-none"
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="Admin">Admin</option>
                  </select>
                </label>
                <label htmlFor="gender" className="text-headingColor font-bold text-[16px]">
                  Gender
                  <select
                    name="gender"
                    id="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="text-textColor font-semibold text-[15px] leading-7 py-3 focus:outline-none"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                  </select>
                </label>
              </div>
              <div className="mb-5 flex items-center gap-3">
                <figure className="w-[60px] h-[60px] rounded-full border border-solid border-primaryColor flex items-center">
                  <img src={avatar} className="w-full rounded-full" alt="" />
                </figure>
                <div className="relative w-[130px] h-[50px]">
                  <input
                    type="file"
                    name="photo"
                    id="customfile"
                    onChange={handleFileinput}
                    accept=".jpg,.png"
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <label
                    htmlFor="customfile"
                    className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
                  >
                    Upload photo
                  </label>
                </div>
              </div>
              <div className="mt-7">
                <button
                  type="submit"
                  className="w-[10rem] bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-4"
                >
                  Register
                </button>
              </div>
              <p className="mt-5 text-textColor text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-primaryColor font-medium ml-1">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
  
}

export default Signup
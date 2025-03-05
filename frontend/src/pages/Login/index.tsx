import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { loginUser } from "../../redux/authSlice";
import { AppDispatch } from "../../redux/store"; // Import AppDispatch
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate if you need navigation

export const Login = () => {
  const dispatch = useDispatch<AppDispatch>(); // Specify the correct dispatch type
  const { error, status } = useSelector((state: RootState) => state.auth);

  // Local state to handle form inputs
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const navigate = useNavigate(); // Navigation hook

  const handleLogin = () => {
    // Dispatch the loginUser action with email and password
    dispatch(loginUser({ email, password }))
      .then((action: any) => {
        if (action.type === 'auth/loginUser/fulfilled') {
          navigate("/invoices");
        }
      })
      .catch((error) => {
        // Handle error if necessary
        console.error("Login failed:", error);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login Page</h2>

        {status === 'loading' && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-600 font-medium mb-2">Email:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-600 font-medium mb-2">Password:</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Login Button */}
        <button 
          onClick={handleLogin} 
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Login
        </button>
      </div>
    </div>
  );
};

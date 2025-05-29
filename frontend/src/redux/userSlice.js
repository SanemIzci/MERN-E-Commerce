import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {
  user: null, 
  isAuth: false, 
  loading: false,
  error: null
};



export const register = createAsyncThunk(
  "register",
  async(data)=>{
    const requestOptions={
        method:"POST",
        headers:{'Content-Type':"application/json"},
        body:JSON.stringify(data)
    };
    const res=await fetch(`http://localhost:4000/users/register`,requestOptions)
    const responseData = await res.json();
    localStorage.setItem("token", responseData?.token);
    return responseData;
  }
);

export const login = createAsyncThunk(
  "login",
  async(data, { dispatch, rejectWithValue }) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {'Content-Type': "application/json"},
        body: JSON.stringify({email: data.email, password: data.password})
      };
      
      const response = await fetch(`http://localhost:4000/users/login`, requestOptions);
      const responseData = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(responseData.message || 'Login failed');
      }
      
      if (!responseData.token) {
        return rejectWithValue('No token received');
      }
      
      localStorage.setItem("token", responseData.token);
      
      // Login başarılı olduktan sonra profile bilgilerini al
      const profileResult = await dispatch(profile()).unwrap();
      return profileResult;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const profile = createAsyncThunk(
  "profile",
  async(_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        return rejectWithValue("No token found")
      }
      
      const res = await fetch(`http://localhost:4000/users/me`, {
        headers: {
          'authorization': `Bearer ${token}`,
        }
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        localStorage.removeItem("token")
        return rejectWithValue(data.message || "Failed to fetch profile")
      }
      
      return data
    } catch (error) {
      localStorage.removeItem("token")
      return rejectWithValue(error.message || "Failed to fetch profile")
    }
  }
);

export const ForgotPassword = createAsyncThunk(
  "forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      };
      const response = await fetch(`http://localhost:4000/users/forgotPassword`, requestOptions);
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.message || 'Something went wrong');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const resetPassword = createAsyncThunk(
  "resetPassword",
  async (params, { rejectWithValue }) => {
    try {
      console.log("Sending reset password request with token:", params.token);
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: params.password })
      };
      console.log("Request options:", requestOptions);
      
      const response = await fetch(`http://localhost:4000/users/reset/${params.token}`, requestOptions);
      const data = await response.json();
      
      console.log("Response status:", response.status);
      console.log("Response data:", data);
      
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to reset password');
      }
      
      return data;
    } catch (error) {
      console.error("Reset password error:", error);
      return rejectWithValue(error.message || 'Network error');
    }
  }
);






const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuth = false;
      state.error = null;
     
    }
  },
  extraReducers: (builder) => {
    builder
      //register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuth = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuth = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //profile
      .addCase(profile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(profile.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuth = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(profile.rejected, (state,action) => {
        state.loading = false;
        state.isAuth = false;
        state.user={}
      })
      //forgot
      .addCase(ForgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ForgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(ForgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //reset
      .addCase(resetPassword.pending, (state,action) => {
        state.loading = true;
        
      })
      .addCase(resetPassword.fulfilled, (state,action) => {
        state.loading = false;
        
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
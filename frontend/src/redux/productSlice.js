import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  products: [], // Ürünler listesi
  product: null, // Tek bir ürünün detayları
  loading: false, // Yükleme durumu
  adminProducts: { products: [] },
  relatedProducts: [],
  error: null,
};



export const getProducts = createAsyncThunk(
  "products/allProducts",
  async (params = {}) => {
    const {
      keyword = '',
      rating,
      price,
      category,
    } = params;

    let query = `http://localhost:4000/products?keyword=${keyword}`;

    if (rating !== undefined && rating !== 0) {
      query += `&rating=${rating}`;
    }

    if (price && price.min !== undefined) {
      query += `&price[gte]=${price.min}`;
    }

    if (price && price.max !== undefined) {
      query += `&price[lte]=${price.max}`;
    }

    if (category) {
      query += `&category=${category}`;
    }

    try {
      const res = await fetch(query);
      const data = await res.json();
      console.log('Fetched products:', data);
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Error fetching products');
    }
  }
);

export const getAdminProducts = createAsyncThunk(
  "products/getAdminProducts",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(`http://localhost:4000/products/admin`, {
        headers: {
          'authorization': `Bearer ${token}`,
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch admin products');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch admin products');
    }
  }
);




export const getProductDetail = createAsyncThunk(
  "products/getProductDetail",
  async (id) => {
    const response = await fetch(`http://localhost:4000/products/${id}`);
    const data = await response.json();
    return data; // API'den dönen tüm veriyi döndürüyoruz
  }
);



export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue('Authentication required');
    }

    try {
      const response = await fetch(`http://localhost:4000/products/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData)
      });
      
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to create product');
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create product');
    }
  }
);

export const createReview = createAsyncThunk(
  "products/createReview",
  async ({ product_id, comment, rating }) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:4000/products/newReview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id, comment, rating })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create review');
    }
    return data;
  }
);

export const getRelatedProducts = createAsyncThunk(
  "getRelatedProducts",
  async (category, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:4000/products/related/${category}`);
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue('Authentication required');
    }

    try {
      const response = await fetch(`http://localhost:4000/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'authorization': `Bearer ${token}`,
        }
      });
      
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to delete product');
      }
      return { productId, ...data };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ productId, productData }, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue('Authentication required');
    }

    try {
      const response = await fetch(`http://localhost:4000/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData)
      });
      
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to update product');
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update product');
    }
  }
);




const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // getProducts
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        console.error('Error fetching products:', action.error.message);
      })
      // getProductDetail
      .addCase(getProductDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload; // Tek bir ürünün detaylarını güncelle
      })
      .addCase(getAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.adminProducts = {
          success: action.payload.success,
          products: action.payload.products || []
        };
      })
      .addCase(getAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch admin products';
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload?.product) {
          state.adminProducts.products.push(action.payload.product);
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create product';
      })
      .addCase(createReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        // Update the product's reviews and rating in the state
        if (state.product?.productDetail) {
          state.product.productDetail.reviews = action.payload.productDetail.reviews;
          state.product.productDetail.rating = action.payload.productDetail.rating;
        }
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        console.error('Error creating review:', action.error.message);
      })
      .addCase(getRelatedProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRelatedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.relatedProducts = action.payload;
      })
      .addCase(getRelatedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Remove the deleted product from the admin products list
        state.adminProducts.products = state.adminProducts.products.filter(
          product => product._id !== action.payload.productId
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete product';
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Update the product in the admin products list
        const index = state.adminProducts.products.findIndex(
          product => product._id === action.payload.updateProduct._id
        );
        if (index !== -1) {
          state.adminProducts.products[index] = action.payload.updateProduct;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update product';
      });
  },
});

export default productSlice.reducer;











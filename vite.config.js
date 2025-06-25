import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
  proxy: {
    "/api": {
      target: "http://localhost:8080",
      changeOrigin: true,
    },
  },
},
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
// This configuration sets up a Vite project with React, enabling proxying API requests to the backend server running on port 5000.
//       );
//       setLoading(false);
//       navigate(`/profile/${id}`);
//     } catch (err) {
//       console.error("Error updating profile:", err);
//       setLoading(false);
//     }
//   };
//
//   return (
//     <div className="edit-profile">

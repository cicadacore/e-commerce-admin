// vite.config.ts
import { defineConfig } from "file:///home/asheeshs/Documents/Practice/admin-E-commerce-Frontend%202/admin-E-commerce-Frontend/node_modules/vite/dist/node/index.js";
import react from "file:///home/asheeshs/Documents/Practice/admin-E-commerce-Frontend%202/admin-E-commerce-Frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import tailwind from "file:///home/asheeshs/Documents/Practice/admin-E-commerce-Frontend%202/admin-E-commerce-Frontend/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///home/asheeshs/Documents/Practice/admin-E-commerce-Frontend%202/admin-E-commerce-Frontend/node_modules/autoprefixer/lib/autoprefixer.js";
import { createHtmlPlugin } from "file:///home/asheeshs/Documents/Practice/admin-E-commerce-Frontend%202/admin-E-commerce-Frontend/node_modules/vite-plugin-html/dist/index.mjs";

// config.ts
var CONFIG = {
  appName: "E-commerce",
  helpLink: "https://github.com/arifszn/reforge",
  enablePWA: true,
  theme: {
    accentColor: "#818cf8",
    sidebarLayout: "mix" /* MIX */,
    showBreadcrumb: true
  },
  metaTags: {
    title: "E-commerce",
    description: "This is a e-commerce website",
    imageURL: "icon.svg"
  }
};
var config_default = CONFIG;

// tailwind.config.mjs
var tailwind_config_default = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: config_default.theme.accentColor
      }
    }
  },
  plugins: []
};

// vite.config.ts
import { VitePWA } from "file:///home/asheeshs/Documents/Practice/admin-E-commerce-Frontend%202/admin-E-commerce-Frontend/node_modules/vite-plugin-pwa/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({
      inject: {
        data: {
          title: config_default.appName,
          metaTitle: config_default.metaTags.title,
          metaDescription: config_default.metaTags.description,
          metaImageURL: config_default.metaTags.imageURL
        }
      }
    }),
    ...config_default.enablePWA ? [
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["icon.svg"],
        manifest: {
          name: config_default.appName,
          short_name: config_default.appName,
          description: config_default.metaTags.description,
          theme_color: config_default.theme.accentColor,
          icons: [
            {
              src: "icon.svg",
              sizes: "64x64 32x32 24x24 16x16 192x192 512x512",
              type: "image/png"
            }
          ]
        }
      })
    ] : []
  ],
  css: {
    postcss: {
      plugins: [tailwind(tailwind_config_default), autoprefixer]
    }
  },
  define: {
    CONFIG: config_default
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiY29uZmlnLnRzIiwgInRhaWx3aW5kLmNvbmZpZy5tanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9hc2hlZXNocy9Eb2N1bWVudHMvUHJhY3RpY2UvYWRtaW4tRS1jb21tZXJjZS1Gcm9udGVuZCAyL2FkbWluLUUtY29tbWVyY2UtRnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2FzaGVlc2hzL0RvY3VtZW50cy9QcmFjdGljZS9hZG1pbi1FLWNvbW1lcmNlLUZyb250ZW5kIDIvYWRtaW4tRS1jb21tZXJjZS1Gcm9udGVuZC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9hc2hlZXNocy9Eb2N1bWVudHMvUHJhY3RpY2UvYWRtaW4tRS1jb21tZXJjZS1Gcm9udGVuZCUyMDIvYWRtaW4tRS1jb21tZXJjZS1Gcm9udGVuZC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCB0YWlsd2luZCBmcm9tICd0YWlsd2luZGNzcyc7XG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gJ2F1dG9wcmVmaXhlcic7XG5pbXBvcnQgeyBjcmVhdGVIdG1sUGx1Z2luIH0gZnJvbSAndml0ZS1wbHVnaW4taHRtbCc7XG5pbXBvcnQgdGFpbHdpbmRDb25maWcgZnJvbSAnLi90YWlsd2luZC5jb25maWcubWpzJztcbmltcG9ydCBDT05GSUcgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBjcmVhdGVIdG1sUGx1Z2luKHtcbiAgICAgIGluamVjdDoge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdGl0bGU6IENPTkZJRy5hcHBOYW1lLFxuICAgICAgICAgIG1ldGFUaXRsZTogQ09ORklHLm1ldGFUYWdzLnRpdGxlLFxuICAgICAgICAgIG1ldGFEZXNjcmlwdGlvbjogQ09ORklHLm1ldGFUYWdzLmRlc2NyaXB0aW9uLFxuICAgICAgICAgIG1ldGFJbWFnZVVSTDogQ09ORklHLm1ldGFUYWdzLmltYWdlVVJMLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KSxcbiAgICAuLi4oQ09ORklHLmVuYWJsZVBXQVxuICAgICAgPyBbXG4gICAgICAgICAgVml0ZVBXQSh7XG4gICAgICAgICAgICByZWdpc3RlclR5cGU6ICdhdXRvVXBkYXRlJyxcbiAgICAgICAgICAgIGluY2x1ZGVBc3NldHM6IFsnaWNvbi5zdmcnXSxcbiAgICAgICAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgICAgICAgIG5hbWU6IENPTkZJRy5hcHBOYW1lLFxuICAgICAgICAgICAgICBzaG9ydF9uYW1lOiBDT05GSUcuYXBwTmFtZSxcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IENPTkZJRy5tZXRhVGFncy5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgdGhlbWVfY29sb3I6IENPTkZJRy50aGVtZS5hY2NlbnRDb2xvcixcbiAgICAgICAgICAgICAgaWNvbnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBzcmM6ICdpY29uLnN2ZycsXG4gICAgICAgICAgICAgICAgICBzaXplczogJzY0eDY0IDMyeDMyIDI0eDI0IDE2eDE2IDE5MngxOTIgNTEyeDUxMicsXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXVxuICAgICAgOiBbXSksXG4gIF0sXG4gIGNzczoge1xuICAgIHBvc3Rjc3M6IHtcbiAgICAgIHBsdWdpbnM6IFt0YWlsd2luZCh0YWlsd2luZENvbmZpZyksIGF1dG9wcmVmaXhlcl0sXG4gICAgfSxcbiAgfSxcbiAgZGVmaW5lOiB7XG4gICAgQ09ORklHOiBDT05GSUcsXG4gIH0sXG59KTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvYXNoZWVzaHMvRG9jdW1lbnRzL1ByYWN0aWNlL2FkbWluLUUtY29tbWVyY2UtRnJvbnRlbmQgMi9hZG1pbi1FLWNvbW1lcmNlLUZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9hc2hlZXNocy9Eb2N1bWVudHMvUHJhY3RpY2UvYWRtaW4tRS1jb21tZXJjZS1Gcm9udGVuZCAyL2FkbWluLUUtY29tbWVyY2UtRnJvbnRlbmQvY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2FzaGVlc2hzL0RvY3VtZW50cy9QcmFjdGljZS9hZG1pbi1FLWNvbW1lcmNlLUZyb250ZW5kJTIwMi9hZG1pbi1FLWNvbW1lcmNlLUZyb250ZW5kL2NvbmZpZy50c1wiOy8vY29uZmlnLnRzXG5cbmVudW0gTGF5b3V0VHlwZSB7XG4gIE1JWCA9ICdtaXgnLFxuICBUT1AgPSAndG9wJyxcbiAgU0lERSA9ICdzaWRlJyxcbn1cblxuY29uc3QgQ09ORklHID0ge1xuICBhcHBOYW1lOiAnRS1jb21tZXJjZScsXG4gIGhlbHBMaW5rOiAnaHR0cHM6Ly9naXRodWIuY29tL2FyaWZzem4vcmVmb3JnZScsXG4gIGVuYWJsZVBXQTogdHJ1ZSxcbiAgdGhlbWU6IHtcbiAgICBhY2NlbnRDb2xvcjogJyM4MThjZjgnLFxuICAgIHNpZGViYXJMYXlvdXQ6IExheW91dFR5cGUuTUlYLFxuICAgIHNob3dCcmVhZGNydW1iOiB0cnVlLFxuICB9LFxuICBtZXRhVGFnczoge1xuICAgIHRpdGxlOiAnRS1jb21tZXJjZScsXG4gICAgZGVzY3JpcHRpb246ICdUaGlzIGlzIGEgZS1jb21tZXJjZSB3ZWJzaXRlJyxcbiAgICBpbWFnZVVSTDogJ2ljb24uc3ZnJyxcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IENPTkZJRztcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvYXNoZWVzaHMvRG9jdW1lbnRzL1ByYWN0aWNlL2FkbWluLUUtY29tbWVyY2UtRnJvbnRlbmQgMi9hZG1pbi1FLWNvbW1lcmNlLUZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9hc2hlZXNocy9Eb2N1bWVudHMvUHJhY3RpY2UvYWRtaW4tRS1jb21tZXJjZS1Gcm9udGVuZCAyL2FkbWluLUUtY29tbWVyY2UtRnJvbnRlbmQvdGFpbHdpbmQuY29uZmlnLm1qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9hc2hlZXNocy9Eb2N1bWVudHMvUHJhY3RpY2UvYWRtaW4tRS1jb21tZXJjZS1Gcm9udGVuZCUyMDIvYWRtaW4tRS1jb21tZXJjZS1Gcm9udGVuZC90YWlsd2luZC5jb25maWcubWpzXCI7aW1wb3J0IENPTkZJRyBmcm9tICcuL2NvbmZpZyc7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCd0YWlsd2luZGNzcycpLkNvbmZpZ30gKi9cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29udGVudDogWycuL2luZGV4Lmh0bWwnLCAnLi9zcmMvKiovKi57anMsdHMsanN4LHRzeH0nXSxcbiAgdGhlbWU6IHtcbiAgICBleHRlbmQ6IHtcbiAgICAgIGNvbG9yczoge1xuICAgICAgICBwcmltYXJ5OiBDT05GSUcudGhlbWUuYWNjZW50Q29sb3IsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFtdLFxufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeWIsU0FBUyxvQkFBb0I7QUFDdGQsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sY0FBYztBQUNyQixPQUFPLGtCQUFrQjtBQUN6QixTQUFTLHdCQUF3Qjs7O0FDSWpDLElBQU0sU0FBUztBQUFBLEVBQ2IsU0FBUztBQUFBLEVBQ1QsVUFBVTtBQUFBLEVBQ1YsV0FBVztBQUFBLEVBQ1gsT0FBTztBQUFBLElBQ0wsYUFBYTtBQUFBLElBQ2IsZUFBZTtBQUFBLElBQ2YsZ0JBQWdCO0FBQUEsRUFDbEI7QUFBQSxFQUNBLFVBQVU7QUFBQSxJQUNSLE9BQU87QUFBQSxJQUNQLGFBQWE7QUFBQSxJQUNiLFVBQVU7QUFBQSxFQUNaO0FBQ0Y7QUFFQSxJQUFPLGlCQUFROzs7QUNyQmYsSUFBTywwQkFBUTtBQUFBLEVBQ2IsU0FBUyxDQUFDLGdCQUFnQiw0QkFBNEI7QUFBQSxFQUN0RCxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsTUFDTixRQUFRO0FBQUEsUUFDTixTQUFTLGVBQU8sTUFBTTtBQUFBLE1BQ3hCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVMsQ0FBQztBQUNaOzs7QUZOQSxTQUFTLGVBQWU7QUFHeEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04saUJBQWlCO0FBQUEsTUFDZixRQUFRO0FBQUEsUUFDTixNQUFNO0FBQUEsVUFDSixPQUFPLGVBQU87QUFBQSxVQUNkLFdBQVcsZUFBTyxTQUFTO0FBQUEsVUFDM0IsaUJBQWlCLGVBQU8sU0FBUztBQUFBLFVBQ2pDLGNBQWMsZUFBTyxTQUFTO0FBQUEsUUFDaEM7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxHQUFJLGVBQU8sWUFDUDtBQUFBLE1BQ0UsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLFFBQ2QsZUFBZSxDQUFDLFVBQVU7QUFBQSxRQUMxQixVQUFVO0FBQUEsVUFDUixNQUFNLGVBQU87QUFBQSxVQUNiLFlBQVksZUFBTztBQUFBLFVBQ25CLGFBQWEsZUFBTyxTQUFTO0FBQUEsVUFDN0IsYUFBYSxlQUFPLE1BQU07QUFBQSxVQUMxQixPQUFPO0FBQUEsWUFDTDtBQUFBLGNBQ0UsS0FBSztBQUFBLGNBQ0wsT0FBTztBQUFBLGNBQ1AsTUFBTTtBQUFBLFlBQ1I7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0YsQ0FBQztBQUFBLElBQ0gsSUFDQSxDQUFDO0FBQUEsRUFDUDtBQUFBLEVBQ0EsS0FBSztBQUFBLElBQ0gsU0FBUztBQUFBLE1BQ1AsU0FBUyxDQUFDLFNBQVMsdUJBQWMsR0FBRyxZQUFZO0FBQUEsSUFDbEQ7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixRQUFRO0FBQUEsRUFDVjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==

const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd", style: true // change importing css to less
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { 
      "@primary-color": "#01BCD4", //
      "@font-family": 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"' ,
      "@text-color": "rgba(0, 0, 0, 0.87)",
      "@border-radius-base": "4px",
      "@menu-dark-bg": '#343a40',
      '@menu-dark-submenu-bg': '#2d3238',
      "@layout-header-background": 'transparent',
     }
  })
);

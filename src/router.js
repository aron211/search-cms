// /* eslint-disable */
import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

function AuthorizationFunction(to, from, next) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('rol'); // Asumiendo que el rol se guarda como 'role' en localStorage

  if (!token) {
    // Si no hay token, redirigir a la página de inicio de sesión
    return next({ name: 'Login' });
  }

  // Definir las rutas permitidas para cada rol
  const rolePermissions = {
    admin: ['Dashboard', 'Client', 'ClientsForm', 'Users', 'UsersFrom', 'Inventory', 'InventoryForm', 'Orders', 'OrdersForm', 'Vendors', 'VendorsForm'],
    tecnico: ['Dashboard', 'MyClient', 'MyClientsForm', 'Orders', 'OrdersForm'],
    user: ['Dashboard', 'Orders', 'OrdersForm']
  };

  // Comprobar si el rol del usuario tiene permiso para la ruta solicitada
  if (rolePermissions[userRole] && rolePermissions[userRole].includes(to.name)) {
    next(); // El usuario tiene permiso, permitir el acceso
  } else {
    // El usuario no tiene permiso, redirigir a la página de error o acceso denegado
    next({ name: 'Error' });
  }
}

export default new Router({
  mode: "hash",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      component: () => import("@/views/pages/Index"),
      children: [
        {
          name: "Lock",
          path: "lock",
          component: () => import("@/views/pages/Lock")
        },
        {
          name: "Error",
          path: "Error",
          component: () => import("@/views/pages/Error")
        },
        {
          name: "Login",
          path: "",
          component: () => import("@/views/pages/Authentication/Login")
        },
        {
          name: "Register",
          path: "register",
          component: () => import("@/views/pages/Register")
        }
      ]
    },
    {
      path: "/home",
      component: () => import("@/views/container/Index"),
      beforeEnter: AuthorizationFunction,
      children: [
        {
          name: "Dashboard",
          path: "dashboard",
          beforeEnter: AuthorizationFunction,
          component: () => import("@/views/container/Dashboard")
        },
        {
          name: "Client",
          path: "clients/clients",
          beforeEnter: AuthorizationFunction,
          component: () => import("@/views/container/Client/Client")
        },
        {
          name: "ClientsForm",
          path: "clients/form",
          beforeEnter: AuthorizationFunction,
          component: () => import("@/views/container/Client/ClientForm")
        },
        {
          name: "MyClient",
          path: "myclients/myclients",
          beforeEnter: AuthorizationFunction,
          component: () => import("@/views/container/MyClients/MyClient")
        },
        {
          name: "MyClientsForm",
          path: "myclients/form",
          beforeEnter: AuthorizationFunction,
          component: () => import("@/views/container/MyClients/MyClientForm")
        },
        {
          name: "Users",
          path: "users/users",
          beforeEnter: AuthorizationFunction,
          component: () => import("@/views/container/Users/Users")
        },
        {
          name: "UsersFrom",
          path: "users/form",
          beforeEnter: AuthorizationFunction,
          component: () => import("@/views/container/Users/UsersFrom")
        },
        {
          name: "Inventory",
          path: "inventory/inventory",
          beforeEnter: AuthorizationFunction,
          component: () => import("@/views/container/Inventory/Inventory")
        },
        {
          name: "InventoryForm",
          path: "inventory/form",
          beforeEnter: AuthorizationFunction,
          component: () => import("@/views/container/Inventory/InventoryForm")
        },
        {
          name: "Orders",
          path: "orders/orders",
          beforeEnter: AuthorizationFunction,
          component: () => import("@/views/container/Orders/Orders")
        },
        {
          name: "OrdersForm",
          path: "orders/form",
          beforeEnter: AuthorizationFunction,
          component: () => import("@/views/container/Orders/OrdersForm")
        },
        {
          name: "Vendors",
          path: "vendors/vendors",
          beforeEnter: AuthorizationFunction,
          component: () => import("@/views/container/Vendors/Vendors")
        },
        {
          name: "VendorsForm",
          path: "vendors/form",
          beforeEnter: AuthorizationFunction,
          component: () => import("@/views/container/Vendors/VendorsForm")
        }
      ]
    }
  ]
});




// import Vue from "vue";
// import Router from "vue-router";

// Vue.use(Router);

// function AuthorizationFunction(to, from, next) {
//   let acction = false
//   if (localStorage.getItem('token')) {
//     // let menu = JSON.parse(localStorage.getItem("modulesAsig"));
//     // console.log(to.name);
//     // for (let mud of menu) {
//     //   console.log(mud.text);
//     //   if (mud.text == to.name || mud.text == from.name) {
//     //     acction = true;
//     //     // next()
//     //     break;
//     //   }
//     // }

//     acction = true
//     if (acction) {
//       next()
//     } else {
//       // alert("Not authorized");
//       next({ name: '404 Error' })
//     }
//   } else {
//     // alert("Debe iniciar sesion");
//     next({ name: 'Login' })
//   }
// }

// export default new Router({
//   mode: "hash",
//   base: process.env.BASE_URL,
//   routes: [
//     {
//       path: "/",
//       component: () => import("@/views/pages/Index"),
//       children: [
//         {
//           name: "Lock",
//           path: "lock",
//           component: () => import("@/views/pages/Lock")
//         },
//         {
//           name: "Login",
//           path: "",
//           component: () => import("@/views/pages/Authentication/Login")
//         },

//         {
//           name: "Register",
//           path: "register",
//           component: () => import("@/views/pages/Register")
//         }
//       ]
//     },
//     {
//       path: "/home",
//       component: () => import("@/views/container/Index"),
//       beforeEnter: AuthorizationFunction,
//       children: [
//         // all user
//         {
//           name: "Dashboard",
//           path: "dashboard",
//           beforeEnter: AuthorizationFunction,
//           component: () => import("@/views/container/Dashboard")
//         },
//         // only rol admin
//         {
//           name: "Client",
//           path: "clients/clients",
//           beforeEnter: AuthorizationFunction,
//           component: () => import("@/views/container/Client/Client")
//         },
//         {
//           name: "ClientsForm",
//           path: "clients/form",
//           beforeEnter: AuthorizationFunction,
//           component: () => import("@/views/container/Client/ClientForm")
//         },
//         //only rol tecnico
//         {
//           name: "MyClient",
//           path: "myclients/myclients",
//           beforeEnter: AuthorizationFunction,
//           component: () => import("@/views/container/MyClients/MyClient")
//         },
//         {
//           name: "MyClientsForm",
//           path: "myclients/form",
//           beforeEnter: AuthorizationFunction,
//           component: () => import("@/views/container/MyClients/MyClientForm")
//         },
//         //only rol admin
//         {
//           name: "Users",
//           path: "users/users",
//           beforeEnter: AuthorizationFunction,
//           component: () => import("@/views/container/Users/Users")
//         },
//         //only rol admin
//         {
//           name: "UsersFrom",
//           path: "users/form",
//           beforeEnter: AuthorizationFunction,
//           component: () => import("@/views/container/Users/UsersFrom")
//         },
//         {
//           name: "Register",
//           path: "register",
//           component: () => import("@/views/pages/Register")
//         },
//         //only rol admin
//         {
//           name: "Inventory",
//           path: "inventory/inventory",
//           beforeEnter: AuthorizationFunction,
//           component: () => import("@/views/container/Inventory/Inventory")
//         },
//         {
//           name: "InventoryForm",
//           path: "inventory/form",
//           beforeEnter: AuthorizationFunction,
//           component: () => import("@/views/container/Inventory/InventoryForm")
//         },
//         // all user
//         {
//           name: "Orders",
//           path: "Orders/Orders",
//           beforeEnter: AuthorizationFunction,
//           component: () => import("@/views/container/Orders/Orders")
//         },
//         {
//           name: "OrdersForm",
//           path: "orders/form",
//           beforeEnter: AuthorizationFunction,
//           component: () => import("@/views/container/Orders/OrdersForm")
//         },

//         // only rol admin
//         {
//           name: "Vendors",
//           path: "Vendors/Vendors",
//           beforeEnter: AuthorizationFunction,
//           component: () => import("@/views/container/Vendors/Vendors")
//         },
//         {
//           name: "VendorsForm",
//           path: "vendors/form",
//             beforeEnter: AuthorizationFunction,
//           component: () => import("@/views/container/Vendors/VendorsForm")
//         },












//         // Requests
//         {
//           name: "Requests",
//           path: "requests/requests",
//           // beforeEnter: AuthorizationFunction,
//           component: () => import("@/views/container/Requests/Requests")
//         },
//         {
//           name: "RequestsForm",
//           path: "requests/form",
//           // beforeEnter: AuthorizationFunction,
//           component: () => import("@/views/container/Requests/RequestsForm")
//         },
//         // Orders

//         // Reviews
//         {
//           name: "Reviews",
//           path: "reviews/reviews",
//           // beforeEnter: AuthorizationFunction,
//           component: () => import("@/views/container/ReviewServices/Reviews")
//         },
//         {
//           name: "ReviewsForm",
//           path: "reviews/form",
//           // beforeEnter: AuthorizationFunction,
//           component: () =>
//             import("@/views/container/ReviewServices/ReviewsForm")
//         },
//         // Promotions
//         {
//           name: "Promotions",
//           path: "promotions/promotions",
//           // beforeEnter: AuthorizationFunction,
//           component: () => import("@/views/container/Promotions/Promotions")
//         },
//         {
//           name: "PromotionsForm",
//           path: "promotions/form",
//           // beforeEnter: AuthorizationFunction,
//           component: () => import("@/views/container/Promotions/PromotionsForm")
//         },

//         {
//           name: "Suggestions",
//           path: "suggestions/suggestions",
//           // beforeEnter: AuthorizationFunction,
//           component: () => import("@/views/container/Suggestions/Suggestions")
//         },
//         {
//           name: "SuggestionsForm",
//           path: "suggestions/suggestionsForm",
//           // beforeEnter: AuthorizationFunction,
//           component: () =>
//             import("@/views/container/Suggestions/SuggestionsForm")
//         },

//         {
//           name: "Claims",
//           path: "claims/claims",
//           // beforeEnter: AuthorizationFunction,
//           component: () => import("@/views/container/Claims/Claims")
//         },
//         {
//           name: "ClaimsForm",
//           path: "claims/claimsForm",
//           // beforeEnter: AuthorizationFunction,
//           component: () => import("@/views/container/Claims/ClaimsForm")
//         },

//         {
//           path: "/requests/request",
//           name: "RequestDetails",
//           component: () => import("@/views/container/Claims/RequestDetails.vue")
//         },

//         // Roles
//         {
//           name: "Roles",
//           path: "roles/roles",
//           //  beforeEnter: AuthorizationFunction,
//           component: () => import("@/views/container/Roles/Roles")
//         },
//         {
//           name: "RolesForm",
//           path: "roles/form",
//           //  beforeEnter: AuthorizationFunction,
//           component: () => import("@/views/container/Roles/RolesForm")
//         },
//         // Tipos de servicios
//         {
//           name: "TypeServices",
//           path: "typeServices/typeServices",
//           //  beforeEnter: AuthorizationFunction,
//           component: () => import("@/views/container/TypeServices/TypeServices")
//         },
//         {
//           name: "TypeServicesForm",
//           path: "typeServices/form",
//           //  beforeEnter: AuthorizationFunction,
//           component: () =>
//             import("@/views/container/TypeServices/TypeServicesForm")
//         },
//         // BLogs
//         {
//           name: "Blogs",
//           path: "blogs/blogs",
//           //  beforeEnter: AuthorizationFunction,
//           component: () => import("@/views/container/Blogs/Blogs")
//         },
//         {
//           name: "BlogsForm",
//           path: "blogs/form",
//           //  beforeEnter: AuthorizationFunction,
//           component: () => import("@/views/container/Blogs/BlogsForm")
//         },
//         {
//           name: "Publications",
//           path: "publications/publications",
//           //  beforeEnter: AuthorizationFunction,
//           component: () => import("@/views/container/Publications/Publications")
//         },
//         {
//           name: "PublicationsForm",
//           path: "publications/form",
//           //  beforeEnter: AuthorizationFunction,
//           component: () =>
//             import("@/views/container/Publications/PublicationsForm")
//         },
//         {
//           name: "Investigation",
//           path: "investigation/investigation",
//           //  beforeEnter: AuthorizationFunction,
//           component: () =>
//             import("@/views/container/Investigation/Investigation")
//         },
//         {
//           name: "InvestigationForm",
//           path: "investigation/form",
//           //  beforeEnter: AuthorizationFunction,
//           component: () =>
//             import("@/views/container/Investigation/InvestigationForm")
//         },
//         {
//           name: "Contact",
//           path: "contact/contact",
//           //  beforeEnter: AuthorizationFunction,
//           component: () => import("@/views/container/Contact/Contact")
//         },
//         {
//           name: "ContactForm",
//           path: "contact/form",
//           //   beforeEnter: AuthorizationFunction,
//           component: () => import("@/views/container/Contact/ContactForm")
//         },

//         // Kitchen
//         {
//           name: "Kitchens",
//           path: "kitchens/kitchens",
//           component: () => import("@/views/container/Kitchens/Kitchens")
//         },
//         {
//           name: "Kitchens-Edit",
//           path: "kitchens/kitchens-edit",
//           component: () =>
//             import("@/views/container/Kitchens/Kitchen-Edit/Kitchen-Edit")
//         },
//         {
//           name: "Kitchens-Show",
//           path: "kitchens/kitchens-show",
//           component: () =>
//             import("@/views/container/Kitchens/Kitchen-Show/Kitchen-Show")
//         },
//         // Kitchen
//         {
//           name: "Vendors",
//           path: "vendors/vendors",
//           component: () => import("@/views/container/Vendors/Vendors")
//         }
//       ]
//     },
//     {
//       path: "*",
//       component: () => import("@/views/pages/Index"),
//       children: [
//         {
//           name: "404 Error",
//           path: "",
//           component: () => import("@/views/pages/Error")
//         }
//       ]
//     }
//   ]
// });

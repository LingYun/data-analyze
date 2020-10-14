const routes = [
  {
    title: "绮罗生",
    icon: "file",
    path: "/home",
  },
  {
    title: "意绮行",
    icon: "user",
    path: "/user",
    childern: [
      {
        title: "列表",
        path: "/user/list",
      },
      {
        title: "添加",
        path: "/user/add",
      },
    ],
  },
  {
    title: "一页书",
    icon: "book",
    path: "/blog",
    childern: [
      {
        title: "列表",
        path: "/blog/list",
      },
      {
        title: "添加",
        path: "/blog/add",
      },
    ],
  },
];

export default routes;

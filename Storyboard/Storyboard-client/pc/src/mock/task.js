export const projects = [
  {
    id: "20191210",
    name: "wxmini",
    phase: [
      {
        id: "1",
        name: "第一部分，原型设计",
        task_group: [
          {
            id: "group-1",
            name: "第一部分",
            color: "DarkOrchid",
            task: [
              {
                id: "0",
                name: "建立数据库",
                description: "",
                due_date: "20191220",
                priority: "high",
                status: "working",
                member: [
                  {
                    id: "123",
                    avatar: "/static/image/user_m_3.png"
                  },
                  {
                    id: "124",
                    avatar: "/static/image/user_f_2.png"
                  }
                ],
                detail: {
                  announcement: "这部分是公告"
                }
              },
              {
                id: "1",
                name: "设计小程序的页面与流程设计",
                description: "",
                due_date: "20191220",
                priority: "medium",
                status: "done",
                member: [
                  {
                    id: "666",
                    avatar: "/static/image/user_m_1.png"
                  }
                ],
                detail: {
                  announcement: "小程序的页面设计仅包含UI部分"
                }
              }
            ]
          },
          {
            id: "group-2",
            name: "第二部分",
            color: "LightCoral",
            task: [
              {
                id: "00",
                name: "人员系统的设计和性能优化",
                description: "",
                due_date: "20191230",
                priority: "high",
                status: "stuck",
                member: [
                  {
                    id: "777",
                    avatar: "/static/image/user_f_1.png"
                  }
                ],
                detail: {
                  announcement: "优化包括数据库的优化"
                }
              },
              {
                id: "11",
                name: "发布小程序上线，搭建HTTPS服务器一台",
                description: "",
                due_date: "20191220",
                priority: "medium",
                status: "planned",
                member: [
                  {
                    id: "987",
                    avatar: "/static/image/user_m_4.png"
                  },
                  {
                    id: "897",
                    avatar: "/static/image/user_f_3.png"
                  },
                  {
                    id: "798",
                    avatar: "/static/image/user_m_1.png"
                  }
                ],
                detail: {
                  announcement: "后期服务的费用需要包含在维护费当中"
                }
              }
            ]
          }
        ]
      },
      {
        id: "2",
        name: "开发部分",
        task_group: [
          {
            id: "group-1",
            name: "测试",
            task: [
              {
                id: "0",
                name: "人员系统的设计和性能优化",
                description: "",
                due_date: "20191230",
                priority: "high",
                status: "stuck",
                member: [
                  {
                    id: "777",
                    avatar: "/static/image/user_f_1.png"
                  }
                ],
                detail: {
                  announcement: "优化包括数据库的优化"
                }
              },
              {
                id: "1",
                name: "发布小程序上线，搭建HTTPS服务器一台",
                description: "",
                due_date: "20191220",
                priority: "medium",
                status: "planned",
                member: [
                  {
                    id: "987",
                    avatar: "/static/image/user_m_4.png"
                  },
                  {
                    id: "897",
                    avatar: "/static/image/user_f_3.png"
                  },
                  {
                    id: "798",
                    avatar: "/static/image/user_m_1.png"
                  }
                ],
                detail: {
                  announcement: "后期服务的费用需要包含在维护费当中"
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "20191217",
    name: "flutter项目",
    phase: [
      {
        id: "1",
        name: "flutter的初步了解",
        task_group: [
          {
            id: "group-1",
            name: "数据库相关",
            color: "MidnightBlue",
            task: [
              {
                id: "0",
                name: "建立数据库",
                description: "",
                due_date: "20191220",
                priority: "high",
                status: "done",
                member: [
                  {
                    id: "987",
                    avatar: "/static/image/user_m_4.png"
                  },
                  {
                    id: "897",
                    avatar: "/static/image/user_f_3.png"
                  },
                  {
                    id: "798",
                    avatar: "/static/image/user_m_1.png"
                  }
                ],
                detail: {
                  announcement: "这部分是公告"
                }
              },
              {
                id: "1",
                name: "设计小程序的页面与流程设计",
                description: "",
                due_date: "20191220",
                priority: "medium",
                status: "stuck",
                member: [
                  {
                    id: "798",
                    avatar: "/static/image/user_m_1.png"
                  }
                ],
                detail: {
                  announcement: "小程序的页面设计仅包含UI部分"
                }
              }
            ]
          }
        ]
      },
      {
        id: "2",
        name: "软件和服务器的架构设计与优化部分",
        task_group: [
          {
            id: "group-1",
            name: "系统设计",
            color: "PaleVioletRed",
            task: [
              {
                id: "0",
                name: "人员系统的设计和性能优化",
                description: "",
                due_date: "20191230",
                priority: "high",
                status: "planned",
                member: [
                  {
                    id: "798",
                    avatar: "/static/image/user_m_1.png"
                  }
                ],
                detail: {
                  announcement: "优化包括数据库的优化"
                }
              },
              {
                id: "1",
                name: "发布小程序上线，搭建HTTPS服务器一台",
                description: "",
                due_date: "20191220",
                priority: "medium",
                status: "working",
                member: [
                  {
                    id: "987",
                    avatar: "/static/image/user_m_4.png"
                  },
                  {
                    id: "897",
                    avatar: "/static/image/user_f_3.png"
                  },
                  {
                    id: "798",
                    avatar: "/static/image/user_m_1.png"
                  }
                ],
                detail: {
                  announcement: "后期服务的费用需要包含在维护费当中"
                }
              }
            ]
          }
        ]
      }
    ]
  }
];

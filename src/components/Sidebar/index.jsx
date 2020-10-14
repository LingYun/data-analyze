import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Menu, Icon } from "antd";
import routers from "./menu/index";
import "./index.less";
const { SubMenu } = Menu;

class SiderMenu extends React.PureComponent {
  renderMenuItem = (item) => (
    <Menu.Item key={`${item.path}`}>
      <Link to={item.path}>
        {/* {item.icon ? <Icon type={`${item.icon}`} /> : null} */}
        <span>{item.title}</span>
      </Link>
    </Menu.Item>
  );

  renderMenu = (menus) =>
    menus.map((item) => {
      if (item.childern && item.childern.length > 0) {
        return (
          <SubMenu
            key={item.path}
            title={
              <span>
                {/* {item.icon ? <Icon type={`${item.icon}`} /> : null} */}
                <span>{item.title}</span>
              </span>
            }
          >
            {item.childern.map((data) => this.renderMenuItem(data))}
          </SubMenu>
        );
      } else {
        return this.renderMenuItem(item);
      }
    });

  render() {
    const { location } = this.props;
    const { pathname } = location;
    const paths = pathname.split("/").filter((item) => !!item);
    const openKey = `/${paths.length > 0 ? paths[0] : ""}`;
    return (
      <div className="side-bar">
        <Menu
          selectedKeys={[pathname]}
          defaultOpenKeys={[openKey]}
          mode="inline"
          theme="dark"
          inlineCollapsed={false}
        >
          {this.renderMenu(routers)}
        </Menu>
      </div>
    );
  }
}

export default withRouter(SiderMenu);

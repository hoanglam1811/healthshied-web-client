import { AndroidOutlined, LeftCircleOutlined, LeftOutlined, RightCircleOutlined, RightOutlined } from "@ant-design/icons";
import { Breadcrumb, Card, Carousel, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import logo from "@/assets/logo.png";

const CustomArrow = ({ className, style, onClick, direction }: any) => {
  return (
    <div
      className={className}
      style={{
        ...style,
        fontSize: "24px",
        color: "black",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2
      }}
      onClick={onClick}
    >
      {direction === "left" ? <LeftOutlined /> : <RightOutlined />}
    </div>
  );
};

const Home = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
    return (
    <Content>
      <div style={{ background: "url('https://cdn.tiemchunglongchau.com.vn/unsafe/1920x0/filters:quality(90):format(webp)/HEADER_BANNER_f8b8df36f0.png')",
        padding: '0 48px',
        minHeight: "30vh",
        backgroundSize: "100% 100%", /* Stretches the background to fully cover the element */
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0% 0%"
      }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{

            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <div className="grid grid-cols-6 gap-4">
            <Card>
              <img src={logo} alt="Logo" />
              What vaccine should I get
            </Card>
            <Card>
              <img src={logo} alt="Logo" />
              Vaccine List
            </Card>
            <Card>
              <img src={logo} alt="Logo" />
              Blogs
            </Card>
            <Card>
              <img src={logo} alt="Logo" />
              Blogs
            </Card>
            <Card>
              <img src={logo} alt="Logo" />
              Vaccine List
            </Card>
            <Card>
              <img src={logo} alt="Logo" />
              Vaccine List
            </Card>
          </div>
          <div style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}>
            <div className="grid grid-cols-6 gap-4 items-center !mt-3">
              <div className="col-span-4 h-[300px]" style={{
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                border: "1px solid #f0f0f0",
              }}>
                <Carousel style={{ height: "100%" }} arrows
                  prevArrow={<CustomArrow direction="left" />}
                  nextArrow={<CustomArrow direction="right" />}
                  autoplay={{dotDuration: true}}
                  dots={{className: "custom-dots"}}
                >
                  <div className="!flex justify-center w-full">
                    <img src={logo} alt="Logo" className="max-h-[300px]"/>
                  </div>
                  <div className="!flex justify-center w-full">
                    <img src={logo} alt="Logo"  className="max-h-[300px]"/>
                  </div>
                  <div className="!flex justify-center w-full">
                    <img src={logo} alt="Logo"  className="max-h-[300px]"/>
                  </div>
                  <div className="!flex justify-center w-full">
                    <img src={logo} alt="Logo"  className="max-h-[300px]"/>
                  </div>
                </Carousel>
              </div>
              <Card className="col-span-2 h-[300px]">
                <img src={logo} alt="Logo" className="max-h-[200px]" />
                Vaccine List
              </Card>
            </div>

            <div className="grid grid-cols-4 gap-4 items-center !px-[50px] !mt-3">
              <div className="flex gap-3 !border-r !border-black !border-dashed text-left">
                <img src={logo} alt="Logo" className="w-3" />
                <div>
                  <div className="!font-bold !text-md">Always safe GSP</div>
                  <div className="!text-sm">Vaccine always safe with quality...</div>
                </div>
              </div>
              <div className="flex gap-3 !border-r !border-black !border-dashed text-left">
                <img src={logo} alt="Logo" className="w-3" />
                <div>
                  <div className="!font-bold !text-md">Always safe GSP</div>
                  <div className="!text-sm">Vaccine always safe with quality...</div>
                </div>
              </div>
              <div className="flex gap-3 !border-r !border-black !border-dashed text-left">
                <img src={logo} alt="Logo" className="w-3" />
                <div>
                  <div className="!font-bold !text-md">Always safe GSP</div>
                  <div className="!text-sm">Vaccine always safe with quality...</div>
                </div>
              </div>   
              <div className="flex gap-3 text-left">
                <img src={logo} alt="Logo" className="w-3" />
                <div>
                  <div className="!font-bold !border-black !text-md">Always safe GSP</div>
                  <div className="!text-sm">Vaccine always safe with quality...</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div>

      </div>
    </Content>
    )
}

export default Home;

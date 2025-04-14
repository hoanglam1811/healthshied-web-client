import RouteNames from "@/constants/routeNames";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Card, Carousel, Divider, Tabs } from "antd";
import { Content } from "antd/es/layout/layout";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getVaccineById } from "@/services/ApiServices/vaccineService";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import TabPane from "antd/es/tabs/TabPane";

const CustomArrow = ({ className, style, onClick, direction }: any) => {
  return (
    <div
      className={className}
      style={{
        ...style,
        fontSize: "24px",
        color: "#399696",
        backgroundColor: "white",
        borderRadius: "50%",
        fontWeight: "bolder",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        zIndex: 2
      }}
      onClick={onClick}
    >
      {direction === "left" ? <LeftOutlined /> : <RightOutlined />}
    </div>
  );
};

const VaccineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const usageInstruct =
    `# Introduction

Vaccines are one of the most significant medical advancements in modern history. They help protect individuals and communities by preparing the immune system to recognize and fight off harmful pathogens before they cause serious illness.

# How Vaccines Work

Vaccines contain weakened or inactive parts of a particular organism (antigen) that triggers an immune response. Once vaccinated, the immune system is trained to respond more efficiently and effectively if it encounters the real pathogen in the future. This process is known as immunological memory.

# Benefits

Vaccination not only helps individuals avoid potentially severe illnesses, but also contributes to herd immunity—protecting those who cannot be vaccinated due to age or medical reasons. Vaccines can reduce hospitalization rates, lower healthcare costs, and even eradicate diseases entirely, as seen with smallpox.

# Common Types

There are several types of vaccines used today:

- **mRNA Vaccines**: These instruct cells to produce a protein that triggers an immune response (e.g., Pfizer-BioNTech, Moderna).
- **Inactivated Vaccines**: Contain killed versions of the germ (e.g., polio vaccine).
- **Live-Attenuated Vaccines**: Use a weakened form of the virus (e.g., MMR vaccine).
- **Subunit, Recombinant, and Conjugate Vaccines**: Use specific pieces of the pathogen, such as proteins or sugars.

Each type has its own advantages and is chosen based on the disease and population.

# Conclusion

Vaccination is a safe and effective way to prevent the spread of infectious diseases. By staying up to date on vaccines, individuals not only protect themselves but also contribute to the health and safety of the broader community. Continued research and public education remain vital for increasing vaccine acceptance and global health security.
`;


  const [vaccine, setVaccine] = useState<any>(null);
  const [headings, setHeadings] = useState<any>([]);
  const [activeKey, setActiveKey] = useState<string>();
  const contentRef = useRef<HTMLDivElement>(null);


  const fetchVaccine = async () => {
    try {
      if (!id) return;
      const response = await getVaccineById(id);
      setVaccine(response);
    }
    catch (err) {
      console.log(err);
    }
  }

  const onTabClick = (key: string) => {
    const element = document.getElementById(key);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveKey(key);
    }
  };

  // Add IDs to headings
  const renderers = {
    h1: ({ children }: any) => {
      const text = children;
      const id = text.toLowerCase().replace(/\s+/g, '-');
      return <h1 id={id}>{children}</h1>;
    },
  };

  useEffect(() => {
    const h1Regex = /^# (.+)$/gm;
    const matches = [...usageInstruct.matchAll(h1Regex)];
    const result = matches.map((m) => ({
      text: m[1],
      id: m[1].toLowerCase().replace(/\s+/g, '-'),
    }));
    setHeadings(result);
    if (result.length > 0) setActiveKey(result[0].id);
  }, [usageInstruct]);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const contentTop = contentRef.current.getBoundingClientRect().top;

      const visibleHeading = headings.findLast(({ id }: any) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top - contentTop <= 20; // heading is visible at the top
      });

      if (visibleHeading && visibleHeading.id !== activeKey) {
        setActiveKey(visibleHeading.id);
      }
    };

    const refEl = contentRef.current;
    refEl?.addEventListener('scroll', handleScroll);

    return () => {
      refEl?.removeEventListener('scroll', handleScroll);
    };
  }, [headings, activeKey]);

  useEffect(() => {
    fetchVaccine();
  }, [])

  if (!id) navigate(RouteNames.HOME);

  return (
    <Content style={{
      minHeight: "85vh",
      padding: '0 48px',
      background: "#F3F5F7"
    }}>
      <Breadcrumb
        className="!py-4"
        items={[
          {
            title: <Link to={RouteNames.HOME}>Home</Link>,
          },
          {
            title: <Link to={RouteNames.VACCINE_LIST}>Vaccine List</Link>,
          },
          {
            title: "Vaccine Detail",
          },
        ]}
      />
      <Card styles={{ body: { width: "100%" } }} className="!w-full !rounded-3xl">
        <div className="!grid !grid-cols-8">
          <div className="!col-span-3 !h-[240px]">
            <Carousel style={{ height: "100%" }} arrows
              prevArrow={<CustomArrow direction="left" />}
              nextArrow={<CustomArrow direction="right" />}
              dots={{ className: "custom-dots" }}
              infinite={false}
            >
              {vaccine?.images?.map((image: any) => (
                <div className="!flex justify-center w-full">
                  <img src={image.imageUrl} alt="Logo" className="max-h-[240px]" />
                </div>
              ))}
            </Carousel>
          </div>
          <div className="!col-span-5 !text-left !pl-4">
            <h3 className="!mb-2 !text-gray-500 !text-xl !font-semibold">{vaccine?.contraindications}</h3>
            <h2 className="!mb-3 !text-3xl !font-bold">{vaccine?.name}</h2>
            <div>
              <span className="!text-4xl !font-semibold !text-orange-500">{vaccine?.price.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span>
              <span>/ {vaccine?.unit}</span>
            </div>

            <Divider style={{ background: "rgba(255, 255, 255, 0.2)" }} />

            <div className="">
              <div className="!flex !gap-4">
                <span className="!w-[200px] !font-semibold !text-black !mr-5">Unit</span>
                <span className="!text-gray-500">{vaccine?.unit}</span>
              </div>
              <div className="!flex !gap-4">
                <span className="!w-[200px] !font-semibold !text-black !mr-5">Recommended Age Range</span>
                <span className="!text-gray-500">{vaccine?.recommendedAgeRange}</span>
              </div>
              <div className="!flex !gap-4">
                <span className="!w-[200px] !font-semibold !text-black !mr-5">Country</span>
                <span className="!text-gray-500">{vaccine?.country}</span>
              </div>
              <div className="!flex !gap-4">
                <span className="!w-[200px] !font-semibold !text-black !mr-5">Producer</span>
                <span className="!text-gray-500">{vaccine?.producer}</span>
              </div>
              <p className="!mt-3 !mb-3">{vaccine?.description}</p>
              <div className="!w-full !flex !justify-center !gap-4">
                <Button
                  className="!rounded-[35px] !w-[50%] !h-[56px] !text-white !bg-[#01A9A8]"
                >
                  <span className="!text-lg">Call advisor now</span>
                </Button>
                <Button
                  className="!rounded-[35px] !w-[50%] !h-[56px] !text-[#01A9A8] !bg-[#E6F7FA] !mb-3"
                >
                  <span className="!text-lg">Chat with doctor</span>
                </Button>
              </div>
            </div>
          </div>

        </div>
      </Card>

      <Card styles={{ body: { width: "100%" } }}
        className="!w-full !text-left !rounded-3xl !mt-4"
      >
        <div ref={contentRef} style={{ overflowY: "auto", width: "100%", display: "flex", height: "300px" }}>
          <div className="!w-[25%] vaccine-detail-tab !sticky">
            <Tabs tabPosition="left"
              activeKey={activeKey}
              onTabClick={onTabClick}>
              {headings.map((h: any) => (
                <TabPane tab={h.text} key={h.id} />
              ))}
            </Tabs>
          </div>
          <div className="markdown-body !w-[80%] !pl-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={renderers}>
              {usageInstruct}
            </ReactMarkdown>
          </div>
        </div>
      </Card>
    </Content>
  )
}

export default VaccineDetail;

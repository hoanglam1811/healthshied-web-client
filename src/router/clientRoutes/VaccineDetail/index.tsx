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
import { getCountries } from "@/services/CountriesService";

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

Vaccines are one of the most significant medical advancements in modern history. They have transformed the way humanity deals with infectious diseases, saving millions of lives and preventing countless cases of illness. The concept of vaccination dates back to the late 18th century, with the development of the smallpox vaccine by Edward Jenner. Since then, vaccines have become a cornerstone of public health.

Vaccines work by training the immune system to recognize and neutralize harmful pathogens—such as viruses and bacteria—before they can cause serious illness. Thanks to widespread immunization programs, diseases that once caused devastating epidemics are now rare or even eradicated in many parts of the world. As science continues to evolve, vaccines are being developed more quickly and effectively, offering hope against both existing and emerging threats.

# How Vaccines Work

The human immune system is designed to detect and eliminate foreign invaders. When the body is exposed to a new pathogen, it mounts an immune response, creating specialized cells and antibodies to fight off the infection. However, this process can take time—sometimes too long to prevent severe illness or death.

Vaccines offer a safer way to develop immunity. They contain weakened, inactivated, or partial forms of a pathogen (known as antigens), which are enough to stimulate the immune system without causing the disease itself. Once the immune system is exposed to these antigens, it "learns" how to respond.

The next time the immune system encounters the real pathogen, it recognizes it and reacts much faster and more effectively. This is due to **immunological memory**, where memory cells remain in the body long-term and can quickly deploy antibodies and defense mechanisms when needed. This principle is what makes vaccination such a powerful preventive tool—it prepares the body in advance.

# Benefits

Vaccination provides a wide range of benefits, both on an individual and societal level. At the personal level, being vaccinated significantly reduces the risk of contracting infectious diseases, and if infection does occur, the symptoms are often milder compared to those in unvaccinated individuals. This is particularly important for diseases like influenza, COVID-19, and hepatitis B, which can have serious complications.

Beyond individual protection, vaccines contribute to **herd immunity**, a phenomenon where enough people in a community are immune to a disease, making its spread unlikely. This helps protect vulnerable populations such as newborns, elderly individuals, and those with compromised immune systems who cannot be vaccinated themselves.

Vaccines also have broad economic benefits. By preventing disease, they reduce healthcare costs associated with treatment, hospitalizations, and long-term care. They also help prevent lost productivity due to illness-related absences from work and school. In some cases, vaccines have even led to the eradication of diseases globally—**smallpox** is a prime example, officially declared eradicated in 1980 following a successful worldwide immunization campaign.

# Common Types

There are several types of vaccines in use today, each developed using different scientific techniques to suit the characteristics of specific diseases and populations:

- **mRNA Vaccines**: These are a relatively new innovation. mRNA vaccines work by delivering a genetic blueprint (messenger RNA) to the body's cells, instructing them to produce a harmless piece of the virus, typically a surface protein. This triggers the immune response without using the actual virus. Examples include the Pfizer-BioNTech and Moderna COVID-19 vaccines. mRNA technology is also being researched for use against cancers and other diseases.

- **Inactivated Vaccines**: These vaccines use viruses or bacteria that have been killed through chemical or physical processes. Though the pathogen is dead, it still elicits an immune response. Inactivated vaccines usually require multiple doses to maintain immunity. A well-known example is the inactivated polio vaccine (IPV).

- **Live-Attenuated Vaccines**: These use a weakened form of the pathogen that is still able to replicate but does not cause disease in healthy individuals. Because they mimic a natural infection closely, they tend to produce strong, long-lasting immunity with fewer doses. Examples include the MMR (measles, mumps, and rubella) and yellow fever vaccines. However, they may not be suitable for people with weakened immune systems.

- **Subunit, Recombinant, and Conjugate Vaccines**: These vaccines include only specific parts of the pathogen—such as a protein or sugar molecule—that are enough to trigger a strong immune response. They are often very safe and suitable for a broad range of people, including those with compromised immunity. Examples include the hepatitis B vaccine (recombinant) and the HPV vaccine (subunit).

Each vaccine type has unique storage, delivery, and dosage considerations, and scientists choose the most appropriate type based on the disease, target population, and available resources.

# Conclusion

Vaccination is one of the safest and most effective ways to prevent the spread of infectious diseases. It not only protects individuals but also supports the well-being of entire communities by reducing disease transmission and safeguarding public health.

The ongoing success of vaccines depends on continued research, education, and equitable access across all regions of the world. Misinformation and vaccine hesitancy remain challenges, making public trust and transparent communication essential. 

By keeping up with recommended vaccination schedules, individuals not only protect themselves but also contribute to a healthier, more resilient global society. In an increasingly connected world where diseases can spread rapidly, vaccines remain a key tool in ensuring a safer, healthier future for everyone.
`;


  const [vaccine, setVaccine] = useState<any>(null);
  const [headings, setHeadings] = useState<any>([]);
  const [activeKey, setActiveKey] = useState<string>();
  const contentRef = useRef<HTMLDivElement>(null);
  const [countriesList, setCountriesList] = useState<any[]>([]);

  useEffect(() => {
    const countries = getCountries();
    setCountriesList(countries);
  }, []);

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
    navigate("#" + key);
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
      return <h1 id={id} style={{ scrollMarginTop: "75px" }}>{children}</h1>;
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

  const OFFSET = 75;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      const visibleHeading = headings.findLast(({ id }: any) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const top = el.offsetTop;
        return scrollY + OFFSET >= top;
      });

      if (visibleHeading && visibleHeading.id !== activeKey) {
        setActiveKey(visibleHeading.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
                {(() => {
                  const country = countriesList.find(c => c.name === vaccine?.country);
                  return country ? (
                    <div className="!flex !items-center !gap-2">
                      <img
                        src={country.flagUrl}
                        alt={country.name}
                        className="!w-6 !h-4 !rounded !object-cover"
                      />
                      <span className="!text-gray-500">{country.name}</span>
                    </div>
                  ) : (
                    <span className="!text-gray-500">{vaccine?.country || "N/A"}</span>
                  );
                })()}
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
        <div ref={contentRef} style={{ width: "100%", display: "flex" }}>
          <div className="!w-[20%] vaccine-detail-tab !sticky !top-[10%] !h-[fit-content]">
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

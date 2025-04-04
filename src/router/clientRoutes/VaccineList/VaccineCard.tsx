import { Card } from "antd";
import Title from "antd/es/typography/Title";
import { useNavigate } from "react-router-dom";

const VaccineCard = ({ vaccine }: { vaccine: any }) => {
  const navigate = useNavigate();

  return(
    <Card
      hoverable
      onClick={() => navigate(`/vaccine-detail/${vaccine.id}`)}
      cover={
        <img className="!max-w-[149px] !max-h-[149px]" alt={vaccine.name} src={"https://cdn.tiemchunglongchau.com.vn/unsafe/256x0/filters:quality(90)/DSC_04646_c19a65fd30.jpg"} />
      }

      style={{ width: "100%", textAlign: "left" }}
      styles={{ cover: { height: "200px", display: "flex", justifyContent: "center", alignItems: "center" }} }
    >
      <Title className="hover:!underline" level={4}>{vaccine.name}</Title>
      <span className="!text-gray-500">{vaccine.recommendedAgeRange}</span>
      <br />
      <span className="">{vaccine.contraindications}</span>
      <br />
      <span className="!text-orange-500">{vaccine.price.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span>
    </Card>
  )
}

export default VaccineCard;

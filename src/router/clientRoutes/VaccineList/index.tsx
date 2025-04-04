import RouteNames from "@/constants/routeNames";
import { getAllVaccines } from "@/services/ApiServices/vaccineService";
import { Breadcrumb, Button, Card, DatePicker, Select } from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VaccineCard from "./VaccineCard";

const { RangePicker } = DatePicker;
const { Option } = Select;

const VaccineList = () => {

  const [filters, setFilters] = useState({
    vaccineType: undefined,
    status: undefined,
    dateRange: [],
  });
  const [loading, setLoading] = useState(false);
  const [vaccines, setVaccines] = useState<any>(null);

  const handleFilterChange = (key:any, value:any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const fetchVaccines = async () => {
    try{
      setLoading(true);
      const response = await getAllVaccines();
      setVaccines(response.vaccines);
    }
    catch(err){
      console.log(err);
    }
    finally{
      setLoading(false);
    }
  }

  const handleApplyFilter = () => {
    console.log("Filters applied:", filters);
    // onFilter(filters);
  };

  useEffect(() => {
    fetchVaccines();
  }, [])

  return(
    <Content style={{ 
      minHeight: "85vh",
      padding: '0 48px',
    }}>
      <Breadcrumb
        className="!py-4"
        items={[
          {
            title: <Link to={RouteNames.HOME}>Home</Link>,
          },
          {
            title: "Vaccine List",
          },
        ]}
      />
      <div className="!flex">
        <Card title="Filter Vaccinations" className="!w-1/6 !sticky">
          <Select
            placeholder="Select Vaccine Type"
            style={{ width: "100%", marginBottom: 10 }}
            onChange={(value) => handleFilterChange("vaccineType", value)}
          >
            <Option value="pfizer">Pfizer</Option>
            <Option value="moderna">Moderna</Option>
            <Option value="johnson">Johnson & Johnson</Option>
          </Select>

          <Select
            placeholder="Select Status"
            style={{ width: "100%", marginBottom: 10 }}
            onChange={(value) => handleFilterChange("status", value)}
          >
            <Option value="pending">Pending</Option>
            <Option value="completed">Completed</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>

          <RangePicker
            style={{ width: "100%", marginBottom: 10 }}
            onChange={(dates) => handleFilterChange("dateRange", dates)}
          />

          <Button type="primary" block onClick={handleApplyFilter}>
            Apply Filter
          </Button>
        </Card>
        <div className="!w-5/6 !pl-3 !grid !grid-cols-4 !gap-4">
          {vaccines?.map((vaccine: any) => (
            <VaccineCard key={vaccine.id} vaccine={vaccine} />
          ))}
        </div>

      </div>



    </Content>
  );
}

export default VaccineList;

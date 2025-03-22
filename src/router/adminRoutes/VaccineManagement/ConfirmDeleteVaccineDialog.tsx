import { Modal } from "antd";
import { useState } from "react";

const ConfirmDeleteVaccineModal = ({ 
  isModalOpen, 
  setIsModalOpen, 
  deletingVaccineId,
  onConfirm,
  fetchVaccines
}: { 
  isModalOpen: boolean; 
  setIsModalOpen: (open: boolean) => void; 
  onConfirm: (id: number) => Promise<void>; 
  deletingVaccineId: any;
  fetchVaccines: any;
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await onConfirm(deletingVaccineId); // Gọi hàm xóa
    setLoading(false);
    setIsModalOpen(false);
    await fetchVaccines();
  };

  return (
    <Modal
      title="Xác nhận xóa"
      open={isModalOpen}
      onOk={handleDelete} // Xử lý xóa với loading
      onCancel={() => setIsModalOpen(false)}
      okText="Xóa"
      cancelText="Hủy"
      okButtonProps={{ danger: true, loading }} // Nút "Xóa" có loading
    >
      <p>Bạn có chắc muốn xóa vaccine này không?</p>
    </Modal>
  );
};

export default ConfirmDeleteVaccineModal;

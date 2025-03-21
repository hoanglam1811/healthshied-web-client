import { Modal } from "antd";
import { useState } from "react";

const ConfirmDeleteStaffModal = ({ 
  isModalOpen, 
  setIsModalOpen, 
  deletingStaffId,
  onConfirm,
  fetchStaffs
}: { 
  isModalOpen: boolean; 
  setIsModalOpen: (open: boolean) => void; 
  onConfirm: (id: number) => Promise<void>; 
  deletingStaffId: any;
  fetchStaffs: any;
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await onConfirm(deletingStaffId); // Gọi hàm xóa
    setLoading(false);
    setIsModalOpen(false);
    await fetchStaffs();
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
      <p>Bạn có chắc muốn xóa nhân viên này không?</p>
    </Modal>
  );
};

export default ConfirmDeleteStaffModal;


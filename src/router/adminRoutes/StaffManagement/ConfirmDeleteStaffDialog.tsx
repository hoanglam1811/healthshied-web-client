import { Modal, notification } from "antd";
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
    try {
      await onConfirm(deletingStaffId);
      notification.success({ message: "Delete successfully!" });
      setIsModalOpen(false);
      await fetchStaffs();
    } catch (error) {
      notification.error({
        message: "Delete failed!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Xác nhận xóa"
      open={isModalOpen}
      onOk={handleDelete}
      onCancel={() => setIsModalOpen(false)}
      okText="Xóa"
      cancelText="Hủy"
      okButtonProps={{ danger: true, loading }}
    >
      <p>Bạn có chắc muốn xóa nhân viên này không?</p>
    </Modal>
  );
};

export default ConfirmDeleteStaffModal;


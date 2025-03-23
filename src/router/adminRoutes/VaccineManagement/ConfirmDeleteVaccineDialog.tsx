import { Modal, notification } from "antd";
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
    try {
      await onConfirm(deletingVaccineId);
      notification.success({
        message: "Delete Successful",
        description: "The vaccine has been successfully deleted.",
      });
    } catch (error) {
      notification.error({
        message: "Delete Failed",
        description: "An error occurred while deleting the vaccine.",
      });
    }
    setLoading(false);
    setIsModalOpen(false);
    await fetchVaccines();
  };

  return (
    <Modal
      title="Delete Confirmation"
      open={isModalOpen}
      onOk={handleDelete}
      onCancel={() => setIsModalOpen(false)}
      okText="Delete"
      cancelText="Cancel"
      okButtonProps={{ danger: true, loading }}
    >
      <p>Are you sure you want to delete this vaccine?</p>
    </Modal>
  );
};

export default ConfirmDeleteVaccineModal;

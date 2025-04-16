import { Modal, notification } from "antd";
import { useState } from "react";

const ConfirmDeleteVaccineCategoryModal = ({
  isModalOpen,
  setIsModalOpen,
  deletingVaccineCategoryId,
  onConfirm,
  fetchVaccineCategories
}: {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  onConfirm: (id: number) => Promise<void>;
  deletingVaccineCategoryId: any;
  fetchVaccineCategories: any;
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onConfirm(deletingVaccineCategoryId);
      notification.success({
        message: "Delete Successful",
        description: "The vaccine category has been successfully deleted.",
      });
    } catch (error) {
      notification.error({
        message: "Delete category Failed",
        description: "An error occurred while deleting the vaccine.",
      });
    }
    setLoading(false);
    setIsModalOpen(false);
    await fetchVaccineCategories();
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
      <p>Are you sure you want to delete this vaccine category?</p>
    </Modal>
  );
};

export default ConfirmDeleteVaccineCategoryModal;

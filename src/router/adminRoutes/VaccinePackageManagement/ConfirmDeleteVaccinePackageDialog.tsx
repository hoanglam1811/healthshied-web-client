import { deleteVaccinePackage } from "@/services/ApiServices/vaccinePackageService";
import { Modal, notification } from "antd";
import { useState } from "react";

const ConfirmDeleteVaccinePackageModal = ({
    isModalOpen,
    setIsModalOpen,
    deletingPackageId,
    onConfirm,
    fetchVaccinePackages
}: {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    onConfirm: (id: number) => Promise<void>;
    deletingPackageId: any;
    fetchVaccinePackages: any;
}) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!deletingPackageId) return;
        setLoading(true);
        try {
            await deleteVaccinePackage(deletingPackageId);
            notification.success({
                message: "Delete Successful",
                description: "The vaccine package has been successfully deleted.",
            });
            await fetchVaccinePackages();
        } catch (error) {
            notification.error({
                message: "Delete Failed",
                description: "An error occurred while deleting the vaccine package.",
            });
        } finally {
            setLoading(false);
            setIsModalOpen(false);
        }
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
            <p>Are you sure you want to delete this vaccine package?</p>
        </Modal>
    );
};

export default ConfirmDeleteVaccinePackageModal;

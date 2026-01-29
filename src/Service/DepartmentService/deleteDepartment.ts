export const deleteDepartment = async (id, DepartmentModel) => {
    const selectedDepartment = await DepartmentModel.findByPk(id);
    if (!selectedDepartment) {
        const error = new Error(`Department with ID ${id} not found.`);
        (error as any).status = 404;
        throw error;
    }
    await selectedDepartment.destroy();
    return selectedDepartment;
}
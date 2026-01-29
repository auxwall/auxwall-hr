export const updateDepartment = async (id, department, DepartmentModel) => {
    const selectedDepartment = await DepartmentModel.findByPk(id);
    if (!selectedDepartment) {
        const error = new Error(`Department with ID ${id} not found.`);
        (error as any).status = 404;
        throw error;
    }
    await selectedDepartment.update(department);
    return selectedDepartment;
}
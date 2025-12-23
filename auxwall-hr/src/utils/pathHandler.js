import path from 'path';

export const getRelativePath = (absolutePath, configUploadPath) => {
    if (!absolutePath || !configUploadPath)
        return null;

    const baseFolder = path.basename(configUploadPath);
    const normalizedPath = absolutePath.replace(/\\/g, '/');
    const parts = normalizedPath.split('/');
    const baseIndex = parts.lastIndexOf(baseFolder);
    return baseIndex !== -1 ? parts.slice(baseIndex).join('/') : path.basename(normalizedPath);
};
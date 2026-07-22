export const saveMedia = async (mediaItem) => {
  // If it's just a folder or doesn't have a raw file, return it
  if (!mediaItem.rawFile) {
    return mediaItem;
  }

  const formData = new FormData();
  formData.append('file', mediaItem.rawFile);

  const response = await fetch('/api/media/upload', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const data = await response.json();
  return {
    ...mediaItem,
    id: data.id,
    name: data.name,
    url: data.url,
    size: data.size,
    type: data.type
  };
};

export const getAllMedia = async () => {
  try {
    const response = await fetch('/api/media');
    if (!response.ok) return [];
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch media", error);
    return [];
  }
};

export const deleteMedia = async (id) => {
  try {
    const response = await fetch(`/api/media/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Failed to delete media');
    }
  } catch (error) {
    console.error("Error deleting media", error);
    throw error;
  }
};

export const deleteMultipleMedia = async (ids) => {
  // We'll delete them sequentially for now
  for (const id of ids) {
    await deleteMedia(id);
  }
};

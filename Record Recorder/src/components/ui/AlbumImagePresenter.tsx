import React, { useEffect, useState } from 'react';

import { Box } from '@mui/material';

interface AlbumImagePresenterProps {
  targetURL: string | null | undefined;
  altText?: string;
  onImageChange?: (newUrl: string) => void; 
  editable?: boolean; // New prop to control interactivity
}

const AlbumImagePresenter = ({ 
  targetURL, 
  altText, 
  onImageChange, 
  editable = false 
}: AlbumImagePresenterProps) => {
  const [url, setUrl] = useState(targetURL);

  useEffect(() => {
    setUrl(targetURL);
  }, [targetURL]);

  const handleClick = () => {
    if (!editable) return;

    const newUrl = prompt("Enter the new image URL:", url ?? "");
    if (newUrl !== null && newUrl.trim() !== "") {
      setUrl(newUrl);
      if (onImageChange) {
        onImageChange(newUrl);
      }
    }
  };

  const placeholder = '/placeholder-album.png';

  return (
    <Box
      component="img"
      src={url || placeholder}
      alt={altText ?? "Album cover"}
      onClick={handleClick}
      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = placeholder;
      }}
      sx={{
        height: 300,
        width: 300,
        objectFit: 'cover',
        borderRadius: 2,
        boxShadow: 3,
        display: 'block',
        mx: 'auto',
        cursor: editable ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': editable ? {
          filter: 'brightness(0.8)',
          transform: 'scale(1.01)',
        } : {},
      }}
    />
  );
};

export default AlbumImagePresenter;
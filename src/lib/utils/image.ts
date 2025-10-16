const IMAGE_URL_PREFIXES = [
    "//img.cu-camper.com/img/",
    "//img.cu-travel.com/img/",
] as const;

type ImageOptions = {
    width?: number;
    height?: number;
    format?: string;
    fit?: 'cut' | 'fill' | 'fit';
};

type SrcSetOptions = {
    sizes?: number[];
    format?: string;
    fit?: 'cut' | 'fill';
};

type WpSrcSetOptions = {
    sizes?: number[];
    width?: number;
    height?: number;
};

export function getCuCamperImageUrl(
    src = "",
    { width = 0, height = 0, format = "jpg", fit = "cut" }: ImageOptions = {},
): string {
    if (!src) {
        return "";
    }

    let size = "";
    if (width > 0) {
        size = `.${width}x`;
        if (height > 0) {
            size += `${height}${fit}`;
        }
    }

    let imgSrc = src;
    const hasPrefix = IMAGE_URL_PREFIXES.some((prefix) => src.includes(prefix));

    if (!hasPrefix) {
        imgSrc = IMAGE_URL_PREFIXES[0] + src;
    }
    imgSrc = imgSrc?.replace ? imgSrc.replace(/\.jpg|\.png|\.webp/g, "") : imgSrc;
    imgSrc += `${size}.${format}`;
    return "https:" + imgSrc.replace( "https://", "//");
}

export async function fetchCuCamperImageMetadata(imageUrl: string): Promise<{ caption: string | null; alt_text: string | null; copyright_holder_name: string | null; width: number | null; height: number | null }> {
  if (!imageUrl) {
    return { caption: null, alt_text: null, copyright_holder_name: null, width: null, height: null };
  }

  const jsonUrl = imageUrl.replace(/\.(jpg|png|webp)$/, '.json.$1');

  try {
    const response = await fetch(jsonUrl);
    if (!response.ok) {
      console.warn(`Failed to fetch image metadata from ${jsonUrl}: ${response.statusText}`);
      return { caption: null, alt_text: null, copyright_holder_name: null, width: null, height: null };
    }
    const metadata = await response.json();
    let copyrightHolderName = metadata.source || null;
    if (copyrightHolderName === 'CANUSA TOURISTIK') {
      copyrightHolderName = 'CU | Camper';
    }
    return {
      caption: metadata.descr || null,
      alt_text: metadata.descr || null,
      copyright_holder_name: copyrightHolderName,
      width: metadata.imageFormat?.width || null,
      height: metadata.imageFormat?.height || null,
    };
  } catch (error) {
    console.error(`Error fetching image metadata for ${imageUrl}:`, error);
    return { caption: null, alt_text: null, copyright_holder_name: null, width: null, height: null };
  }
}

/**
 * Image DB srcset generator
 * @param src
 * @param sizes
 * @param format
 * @param fit
 * @return {string}
 */
export function generateCuCamperSrcSet(
    src: string,
    {
        sizes = [320, 480, 680, 860, 1024, 1280, 1920],
        format = "jpg",
        fit = "cut",
    }: SrcSetOptions = {},
): string {
    if (!sizes?.length) {
        return "";
    }

    const srcsetParts = sizes.map((size) => {
        const url = getCuCamperImageUrl(src, { width: size, height: 0, format, fit });
        return `${url} ${size}w`;
    });

    return srcsetParts.join(", ");
}

/**
 * Image DB srcset generator
 * @param src
 * @param {sizes:Array, width:int, height:int}
 * @return {string}
 */
export function generateWpSrcSet(
    src: string,
    { sizes = [150, 300, 768, 1024, 1536, 1920], width = 16, height = 9 }: WpSrcSetOptions = {},
): string {
    if (!sizes?.length) {
        return "";
    }

    const srcsetParts = sizes.map((sizeW) => {
        let url = src;
        if (sizeW < 1920) {
            const split = url.split(".");
            const sizeH = Math.round((sizeW / width) * height);
            split[split.length - 2] += `-${sizeW}x${sizeH}`;
            url = split.join(".");
        }
        return `${url} ${sizeW}w`;
    });

    return srcsetParts.join(", ");
}

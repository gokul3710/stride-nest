export const toFilterQuery = (filters: any) => {
  let sort: object;
  if (filters) {
    if (filters.brand) {
      if (Array.isArray(filters.brand)) {
        filters.brand = { $in: filters.brand };
      }
    }

    // if (filters.brand) {
    //     if (Array.isArray(filters.brand)) {
    //         let brands = filters.brand.map((brand: string)=> brand.toLowerCase())
    //         delete filters.brand;
    //         filters['brand.name'] = { $in: brands }
    //     }else{
    //         filters['brand.name'] = filters.brand
    //         delete filters.brand;
    //     }
    // }

    if (filters.color) {
      if (Array.isArray(filters.color)) {
        filters.color = { $in: filters.color };
      }
    }

    if (filters.style) {
      if (Array.isArray(filters.style)) {
        filters.style = { $in: filters.style };
      }
    }

    // if (filters.style) {
    //     if (Array.isArray(filters.style)) {
    //         let styles = filters.style.map((style: string)=> style.toLowerCase())
    //         delete filters.style;
    //         filters['style.name'] = { $in: styles }
    //     }else{
    //         filters['style.name'] = filters.style
    //         delete filters.style;
    //     }
    // }

    if (filters.material) {
      if (Array.isArray(filters.material)) {
        filters.material = { $in: filters.material };
      }
    }

    if (filters.condition) {
      if (Array.isArray(filters.condition)) {
        filters.condition = { $in: filters.condition };
      }
    }

    // if (filters.category) {
    //     if (Array.isArray(filters.category)) {
    //         filters.category = { $in: filters.category }
    //     }
    // }

    if (filters.price) {
      if (Array.isArray(filters.price)) {
        if (filters.price[1] === 'lte') {
          filters.price = { $lte: Number(filters.price[0]) };
        } else if (filters.price[1] === 'gte') {
          filters.price = { $gte: Number(filters.price[0]) };
        } else if (!isNaN(filters.price[1])) {
          const priceNumbers = filters.price.map((price: string) =>
            Number(price),
          );
          const minPrice = Math.min(...priceNumbers);
          const maxPrice = Math.max(...priceNumbers);
          filters.price = {
            $gte: minPrice,
            $lte: maxPrice,
          };
        }
      }
    }

    if (filters.size) {
      if (Array.isArray(filters.size)) {
        if (filters.size[1] === 'lte') {
          filters.size = { $lte: Number(filters.size[0]) };
        } else if (filters.size[1] === 'gte') {
          filters.size = { $gte: Number(filters.size[0]) };
        } else if (!isNaN(filters.size[1])) {
          const sizeNumbers = filters.size.map((size: string) => Number(size));
          const minSize = Math.min(...sizeNumbers);
          const maxSize = Math.max(...sizeNumbers);
          filters.size = {
            $gte: minSize,
            $lte: maxSize,
          };
        }
      }
    }

    if (filters.year) {
      if (Array.isArray(filters.year)) {
        if (filters.year[1] === 'lte' || filters.year[0] === 'lte') {
          filters.year = { $lte: Number(filters.year[0]) };
        } else if (filters.year[1] === 'gte' || filters.year[0] === 'gte') {
          filters.year = { $gte: Number(filters.year[0]) };
        } else if (!isNaN(filters.year[1])) {
          const yearNumbers = filters.year.map((year: string) => Number(year));
          const minYear = Math.min(...yearNumbers);
          const maxYear = Math.max(...yearNumbers);
          filters.year = {
            $gte: minYear,
            $lte: maxYear,
          };
        }
      }
    }

    if (filters.sort) {
      if (filters.sort[0] === '-1' || filters.sort[0] === '1') {
        sort = {
          [filters.sort[1]]: parseInt(filters.sort[0]),
        };
      } else if (filters.sort[1] === '-1' || filters.sort[1] === '1') {
        sort = {
          [filters.sort[0]]: parseInt(filters.sort[1]),
        };
      }
      delete filters.sort;
    }
  }
  return [filters, sort];
};

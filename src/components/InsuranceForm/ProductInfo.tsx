import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { IconWrapper } from "./utils";
import { SERVICES, TEXT_CONTENT } from "./constants";

interface ProductInfoProps {
  product: {
    name: string;
    image: string;
  };
}

export const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <Card className="py-4">
      <CardBody className="overflow-visible py-2 items-center">
        <Image
          alt={product.name}
          className="object-cover rounded-xl"
          src={product.image}
          width={270}
        />
        <div className="flex flex-col self-center">
          <h4 className="font-bold text-large">{product.name}</h4>
          <small className="text-default-500">{TEXT_CONTENT.subtitle}</small>
          <p className="text-tiny uppercase font-bold mt-4 mb-2">
            {TEXT_CONTENT.lossesTitle}
          </p>
          <Listbox
            aria-label="Services Covered"
            className="p-0 gap-0 bg-content1 max-w-[300px] overflow-visible shadow-small rounded-medium"
            itemClasses={{
              base: "px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80",
            }}
          >
            {SERVICES.map((service) => (
              <ListboxItem
                key={service.key}
                startContent={<IconWrapper className={service.color}>{service.icon}</IconWrapper>}
              >
                {service.label}
              </ListboxItem>
            ))}
          </Listbox>
        </div>
      </CardBody>
    </Card>
  );
};
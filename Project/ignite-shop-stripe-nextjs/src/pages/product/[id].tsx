import { GetStaticProps } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Stripe from 'stripe'
import { stripe } from '../../lib/stripe'
import {
  ImageContainer,
  ProductContainer,
  ProductDetails,
} from '../../styles/pages/product'

type ProductsType = {
  id: string
  name: string
  imageUrl: string
  url: string
  price: number
  description: string
}

interface ProductProps {
  product: ProductsType
}

export default function Product({ product }: ProductProps) {
  const { query } = useRouter()

  return (
    <ProductContainer>
      <ImageContainer>
        <Image width={520} height={480} src={product.imageUrl} alt="shirt" />
      </ImageContainer>
      <ProductDetails>
        <h1>Camiseta X</h1>
        <span>R$ 79,90</span>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
          obcaecati provident soluta natus quas optio iste illo deserunt,
          voluptas nobis ab eos ex in. Excepturi quo dicta qui perferendis nemo.
        </p>

        <button>Comprar agora</button>
      </ProductDetails>
    </ProductContainer>
  )
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({
  params,
}) => {
  const procuctId = params.id

  const product = await stripe.products.retrieve(procuctId, {
    expand: ['default_price'],
  })

  const price = product.default_price as Stripe.Price

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        url: product.url,
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(price.unit_amount / 100),
        description: product.description,
      },
    },
    revalidate: 60 * 60 * 1, // 1hour
  }
}

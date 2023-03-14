import Image from "next/image"
import { HomeContainer, Product } from "../styles/pages/home"
// import camiseta1 from "../assets/camisetas/1.png"
import { useKeenSlider } from 'keen-slider/react'

import 'keen-slider/keen-slider.min.css'
import { stripe } from "../../lib/stripe"
import { GetServerSideProps, GetStaticProps } from "next"
import Stripe from "stripe"

interface IProps {
  products: {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
  }[]
}

export default function Home({ products }: IProps) {

  const [ sliderRef ] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48
    }
  })

  return (
    <HomeContainer ref={sliderRef} className="keen-slider">
      {products.map( product => {

        return (
          <Product key={product.id} className="keen-slider__slide">
            <img src={product.imageUrl} width={520} height={480} alt="" />
            <footer>
              <strong>Camiseta X</strong>
              <span>R$ 79.90</span>
            </footer>
          </Product>
        )
      })}
    </HomeContainer>
  )
}

// export const getServerSideProps: GetServerSideProps = async () => {
export const getStaticProps: GetStaticProps = async () => {


  const response = await stripe.products.list({
    expand: ['data.default_price']
  })

  const products = response.data.map(product => {
    const price = product.default_price as Stripe.Price | null
    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0] ? product.images[0] : null,
      price: price && price.unit_amount ? price.unit_amount / 100 : 0
    }
  })

  return {
    props: {
      products
    }
  }
}
'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/Card'

interface EquipmentCategory {
  id: string
  title: string
  description: string
  image: string
  link: string
  highlighted?: boolean
}

const equipmentCategories: EquipmentCategory[] = [
  {
    id: 'tsd',
    title: 'Терминалы сбора данных',
    description: 'Мобильные компьютеры для сбора и обработки данных в складской логистике',
    image: '/images/equipment/zebra_mc3300ax.png',
    link: '/catalog/tsd'
  },
  {
    id: 'scanners',
    title: 'Сканеры штрих кода',
    description: 'Ручные и стационарные сканеры для считывания штрих-кодов различных типов',
    image: '/images/equipment/zebra_ds2208-hc.png',
    link: '/catalog/scanners',
    highlighted: true
  },
  {
    id: '3d-scan',
    title: '3D scan определение ВГХ',
    description: 'Системы измерения габаритов и веса для логистических центров',
    image: '/images/equipment/caml-05.png',
    link: '/catalog/3d-scan'
  },
  {
    id: 'printers',
    title: 'Принтеры этикеток',
    description: 'Термо- и термотрансферные принтеры для печати этикеток и бирок',
    image: '/images/equipment/Zebra_ZD421C_Ribbon_Cartridge_Desktop_Barcode_Label_Printer_Right_Printing__81871.1754573824.png',
    link: '/catalog/printers'
  },
  {
    id: 'wifi',
    title: 'Wi-Fi оборудование',
    description: 'Промышленные точки доступа и сетевое оборудование для склада',
    image: '/images/equipment/Cisco_Access-Point.png',
    link: '/catalog/wifi'
  },
  {
    id: 'refurbished',
    title: 'Восстановленные ТСД',
    description: 'Восстановленные терминалы сбора данных с гарантией качества',
    image: '/images/equipment/Datalogic-Memor-11-Review-featured-image.png',
    link: '/catalog/refurbished'
  }
]

export function EquipmentCategories() {
  return (
    <section className="py-12 bg-gradient-to-b from-slate-800 to-slate-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border border-orange-400/40 rounded-lg transform rotate-12 animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border border-orange-400/30 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 border border-orange-400/35 rounded-lg transform -rotate-6 animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 border border-orange-400/40 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-orange-400/30 rounded-lg transform rotate-45 animate-pulse delay-500"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 border border-orange-400/35 rounded-full animate-pulse delay-200"></div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-red-500/5 to-orange-500/5 animate-pulse"></div>

      <div className="container mx-auto px-4 relative z-10 fade-in-up">
        <div className="text-center mb-8 fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Оборудование для автоматизации
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto overflow-visible">
          {equipmentCategories.map((category) => (
            <Link key={category.id} href={category.link}>
              <Card className={`
                group relative h-full transition-all duration-500 hover:-translate-y-2 cursor-pointer
                ${category.highlighted 
                  ? 'bg-gradient-to-br from-orange-500 to-red-600 border-orange-400/50 shadow-2xl shadow-orange-500/25' 
                  : 'bg-slate-800/80 border-slate-700/50 hover:bg-slate-700/80'
                }
                backdrop-blur-sm hover:shadow-2xl overflow-visible
              `}>
                {/* Image Container - Сжатый размер */}
                <div className="relative h-48 flex items-center justify-center p-3 overflow-visible">
                  {/* Background Glow Effect */}
                  <div className={`
                    absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500 rounded-t-lg
                    ${category.highlighted 
                      ? 'bg-gradient-to-br from-orange-300/20 to-red-400/20' 
                      : 'bg-gradient-to-br from-slate-600/20 to-slate-500/20'
                    }
                  `}></div>
                  
                  {/* Equipment Image - Сжатые размеры */}
                  <div className="relative z-20 w-full h-full flex items-center justify-center overflow-visible">
                    <img 
                      src={category.image} 
                      alt={category.title}
                      className={`w-auto h-auto object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl transform group-hover:-translate-y-2 ${
                        category.id === 'scanners' 
                          ? 'max-w-[160px] max-h-[160px]'
                          : category.id === 'printers' || category.id === '3d-scan'
                            ? 'max-w-[220px] max-h-[220px]'
                            : 'max-w-[200px] max-h-[200px]'
                      }`}
                      style={{ transformOrigin: 'center center' }}
                    />
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute top-3 right-3 w-2 h-2 bg-orange-400/60 rounded-full animate-pulse delay-300"></div>
                  <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-red-400/60 rounded-full animate-pulse delay-700"></div>
                </div>

                {/* Content - Более компактный */}
                <div className="p-4 pt-2">
                  <h3 className={`
                    text-lg font-bold mb-2 group-hover:text-white transition-colors duration-300
                    ${category.highlighted ? 'text-white' : 'text-slate-200'}
                  `}>
                    {category.title}
                  </h3>
                  <p className={`
                    text-sm leading-relaxed group-hover:text-slate-100 transition-colors duration-300
                    ${category.highlighted ? 'text-orange-100' : 'text-slate-400'}
                  `}>
                    {category.description}
                  </p>
                </div>

                {/* Highlight Badge */}
                {category.highlighted && (
                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs font-semibold text-white">Популярное</span>
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8">
          <Link href="/catalog">
            <button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white px-6 py-3 rounded-lg font-semibold text-base shadow-2xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 transform hover:scale-105">
              Посмотреть весь каталог
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

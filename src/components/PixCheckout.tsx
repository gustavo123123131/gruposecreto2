
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { PushinPayService, PixResponse, PaymentStatus } from '@/services/pushinpay';
import { useToast } from '@/hooks/use-toast';
import { Copy, CheckCircle, AlertCircle, RefreshCw, Star, Shield, QrCode } from 'lucide-react';

const PixCheckout = () => {
  const [valor] = useState<string>('42.90');
  const [pixData, setPixData] = useState<PixResponse | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const gerarPix = async () => {
    try {
      setLoading(true);
      const valorNumerico = parseFloat(valor);
      
      console.log('Gerando PIX com valor:', valorNumerico);
      
      const response = await PushinPayService.gerarPix(valorNumerico);
      console.log('Resposta do PIX:', response);
      
      setPixData(response);
      setPaymentStatus(null);
      
      toast({
        title: "PIX gerado com sucesso!",
        description: "Escaneie o QR Code ou copie o código PIX",
      });
      
    } catch (error) {
      console.error('Erro ao gerar PIX:', error);
      toast({
        title: "Erro ao gerar PIX",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const verificarPagamento = async () => {
    if (!pixData) return;
    
    try {
      const status = await PushinPayService.verificarPagamento(pixData.id);
      setPaymentStatus(status);
      
      if (status.status === 'confirmed' || status.status === 'completed' || status.status === 'paid') {
        toast({
          title: "Pagamento confirmado! 🎉",
          description: "Redirecionando para o WhatsApp...",
        });
        
        setTimeout(() => {
          window.open('https://wa.me/5511999999999?text=Pagamento%20confirmado!%20Gostaria%20de%20acessar%20o%20grupo%20VIP', '_blank');
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao verificar pagamento:', error);
    }
  };

  const copiarPixCola = () => {
    if (pixData?.qr_code) {
      navigator.clipboard.writeText(pixData.qr_code);
      toast({
        title: "PIX copiado!",
        description: "Código PIX copiado para a área de transferência",
      });
    }
  };

  // Auto-verificação de pagamento a cada 5 segundos se houver PIX ativo
  useEffect(() => {
    if (!pixData || paymentStatus?.status === 'confirmed' || paymentStatus?.status === 'completed' || paymentStatus?.status === 'paid') {
      return;
    }

    const interval = setInterval(() => {
      verificarPagamento();
    }, 5000);

    return () => clearInterval(interval);
  }, [pixData, paymentStatus]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url('/lovable-uploads/ae8c95fe-9468-4846-b4b1-e2d18a3abe12.png')`
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/90 via-black/95 to-black/100" />
      
      <div className="relative z-10 max-w-md mx-auto p-4">
        {/* Cabeçalho */}
        <div className="text-center mb-6 pt-8">
          <h1 className="text-3xl font-bold text-white mb-2">🔥 Vagas Limitadas Hoje!</h1>
          <p className="text-red-400 text-xl font-semibold">Grupo Secreto</p>
          <div className="flex items-center justify-center mt-2">
            <Shield className="w-5 h-5 text-red-400 mr-2" />
            <span className="text-gray-300 text-sm font-medium">100% Sigiloso & Garantido</span>
          </div>
        </div>

        {/* Card Principal */}
        <Card className="bg-black/90 border-red-600/70 text-white shadow-2xl backdrop-blur-sm">
          <CardContent className="p-6">
            {/* Produto */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Star className="w-8 h-8 text-red-500 mr-3 fill-current" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Acesso VIP Premium</h3>
                  <p className="text-sm text-red-300">Grupo das Casadas Safadas</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-red-500">R$ {valor}</p>
              </div>
            </div>

            {/* Benefícios */}
            <div className="mb-6 bg-gradient-to-r from-red-900/50 to-red-800/50 p-4 rounded-lg border border-red-600/50">
              <h4 className="text-red-300 font-semibold mb-3 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                ✨ Acesso Exclusivo Inclui:
              </h4>
              <ul className="space-y-2 text-sm text-gray-200">
                <li className="flex items-center">
                  <span className="text-red-400 mr-2">•</span>
                  <span>360 pessoas online agora</span>
                </li>
                <li className="flex items-center">
                  <span className="text-red-400 mr-2">•</span>
                  <span>136 novos membros hoje</span>
                </li>
                <li className="flex items-center">
                  <span className="text-red-400 mr-2">•</span>
                  <span>Mulheres discretas e decididas</span>
                </li>
                <li className="flex items-center">
                  <span className="text-red-400 mr-2">•</span>
                  <span>Grupo super organizado</span>
                </li>
                <li className="flex items-center">
                  <span className="text-red-400 mr-2">•</span>
                  <span>98% de taxa de sucesso</span>
                </li>
                <li className="flex items-center">
                  <span className="text-red-400 mr-2">•</span>
                  <span className="text-red-300 font-semibold">Apenas 147 vagas restantes</span>
                </li>
              </ul>
            </div>

            {/* Garantias */}
            <div className="mb-6 bg-gradient-to-r from-gray-900/50 to-gray-800/50 p-4 rounded-lg border border-gray-600/30">
              <div className="flex items-center justify-center space-x-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold text-xs">60<br/>DIAS</span>
                  </div>
                  <p className="text-xs text-red-400">Garantia</p>
                </div>
                <div className="text-center">
                  <Shield className="w-16 h-16 text-red-500 mx-auto mb-2" />
                  <p className="text-xs text-red-400">Sigilo Total</p>
                </div>
              </div>
            </div>

            {/* QR Code */}
            {pixData && (
              <div className="text-center mb-6">
                <div className="bg-white p-4 rounded-lg inline-block mb-4">
                  <img 
                    src={pixData.qr_code_base64}
                    alt="QR Code PIX"
                    className="w-48 h-48"
                    onError={(e) => {
                      console.error('Erro ao carregar QR Code:', e);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <p className="text-red-300 text-sm mb-4">Escaneie o QR Code para pagar</p>
                <p className="text-red-300 text-xs mb-4">
                  Pagamento via Pix • Aprovação instantânea
                </p>
              </div>
            )}
            
            {/* PIX Copia e Cola */}
            {pixData && (
              <div className="mb-6">
                <Label className="text-sm text-red-300 mb-2 block font-semibold">
                  Chave Pix:
                </Label>
                <div className="bg-gray-900 p-3 rounded-lg text-xs font-mono text-gray-300 mb-3 break-all border border-red-600/50">
                  {pixData.qr_code}
                </div>
                <Button
                  onClick={copiarPixCola}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Copy className="w-5 h-5 mr-2" />
                  Copiar PIX
                </Button>
              </div>
            )}

            {/* Botão Gerar PIX */}
            {!pixData && (
              <div className="mb-4">
                <Button 
                  onClick={gerarPix} 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Gerando PIX...
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5 mr-2" />
                      Copiar PIX - R$ 24,90
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Aviso de Segurança */}
            <div className="text-center mt-6">
              <div className="flex items-center justify-center text-xs text-red-300 mb-2">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span>Pagamento seguro via PushinPay • Apenas para adultos (18+)</span>
              </div>
              <p className="text-xs text-gray-400">
                Após o pagamento, você será redirecionado para o WhatsApp automaticamente.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Status de Pagamento Confirmado */}
        {paymentStatus && (paymentStatus.status === 'confirmed' || paymentStatus.status === 'completed' || paymentStatus.status === 'paid') && (
          <Card className="mt-6 bg-gradient-to-r from-green-800 to-green-700 border-green-500 text-white shadow-xl">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Pagamento Confirmado!</h3>
              <p className="text-green-200 mb-4">
                Seu pagamento de <strong>R$ {(paymentStatus.value / 100).toFixed(2)}</strong> foi processado com sucesso.
              </p>
              <p className="text-sm text-green-300">
                Redirecionando para o WhatsApp...
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PixCheckout;

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCustomerOrders } from "@/lib/shopify";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Package, ExternalLink, Truck, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Order History | Terrace Shop",
};

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.accessToken) {
    redirect("/login");
  }

  const orders = await getCustomerOrders(session.accessToken);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:py-24">
      {/* Header - Industrial Style */}
      <div className="mb-12 border-b-2 border-emerald-950 pb-8">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-emerald-950 italic sm:text-5xl leading-[0.9]">
          Order History
        </h1>
        <div className="mt-4 flex items-center gap-2">
          <span className="h-1.5 w-1.5 bg-amber-400 rounded-full" />
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Past Fixtures & Returns
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 bg-zinc-50/50 py-24 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center bg-zinc-100 border-2 border-zinc-200">
            <Package className="h-8 w-8 text-zinc-400" />
          </div>
          <h3 className="text-xl font-black uppercase italic text-emerald-950 mb-2">
            No Orders Yet
          </h3>
          <p className="mb-8 max-w-sm text-sm font-medium text-zinc-500">
            You haven&apos;t placed any orders yet. Start adding some kit to
            your rotation.
          </p>
          <Button
            asChild
            className="h-14 rounded-none bg-emerald-950 text-white font-black uppercase tracking-widest hover:bg-emerald-900 px-8"
          >
            <Link href="/search">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {orders.map(({ node }: any) => {
            const date = new Date(node.processedAt).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            );

            const fulfillment = node.successfulFulfillments?.[0];
            const tracking = fulfillment?.trackingInfo?.[0];
            const carrier = fulfillment?.trackingCompany;

            return (
              <Card
                key={node.id}
                className="overflow-hidden border-2 border-zinc-100 rounded-none shadow-none hover:border-amber-400 transition-colors duration-300 group"
              >
                {/* Card Header */}
                <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-100 bg-zinc-50/80 px-6 py-4">
                  <div className="space-y-1">
                    <CardTitle className="font-black text-base uppercase tracking-tight text-emerald-950 flex items-center gap-2">
                      Order #{node.orderNumber}
                    </CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Placed on {date}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
                    <Badge
                      variant="secondary"
                      className={`rounded-none px-2 py-1 text-[10px] font-bold uppercase tracking-wider border ${
                        node.fulfillmentStatus === "FULFILLED"
                          ? "bg-emerald-100 text-emerald-900 border-emerald-200"
                          : "bg-zinc-100 text-zinc-500 border-zinc-200"
                      }`}
                    >
                      {node.fulfillmentStatus}
                    </Badge>
                    <span className="font-mono text-sm font-bold text-emerald-900">
                      {formatPrice(node.totalPrice.amount)}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-4 overflow-hidden py-1 pl-1">
                        {node.lineItems.edges.map(
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          ({ node: item }: any, i: number) =>
                            item.variant?.image && (
                              <div
                                key={i}
                                className="relative h-16 w-16 bg-zinc-100 border-2 border-white shadow-sm hover:z-10 hover:scale-105 transition-transform"
                              >
                                <Image
                                  src={item.variant.image.url}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )
                        )}
                      </div>
                      <div className="text-xs font-bold uppercase text-zinc-400 tracking-wide">
                        {node.lineItems.edges.length} Item
                        {node.lineItems.edges.length > 1 ? "s" : ""}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                      {tracking && (
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                            <Truck className="h-3 w-3" />
                            {carrier || "Courier"}
                          </div>
                          <p className="font-mono text-xs font-bold text-emerald-900 mt-0.5">
                            {tracking.number}
                          </p>
                        </div>
                      )}

                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-10 rounded-none border-2 border-zinc-200 px-6 text-xs font-bold uppercase tracking-widest hover:bg-emerald-950 hover:text-white hover:border-emerald-950 transition-all"
                      >
                        <a
                          href={node.statusUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          {tracking ? "Track Package" : "View Status"}
                          {tracking ? (
                            <ArrowRight className="h-3 w-3" />
                          ) : (
                            <ExternalLink className="h-3 w-3" />
                          )}
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

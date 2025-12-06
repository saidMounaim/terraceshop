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
import { Package, ExternalLink, Truck } from "lucide-react";

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
      <div className="mb-12 border-b border-zinc-200 pb-6">
        <h1 className="text-3xl font-extrabold uppercase tracking-tighter text-zinc-950 sm:text-4xl">
          Order History
        </h1>
        <p className="mt-2 text-zinc-500">
          Check the status of your recent orders, returns, and tracking.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
            <Package className="h-8 w-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-bold uppercase text-zinc-900">
            No orders yet
          </h3>
          <p className="mb-8 max-w-sm text-sm text-zinc-500">
            You haven&apos;t placed any orders yet. Start adding some kit to
            your rotation.
          </p>
          <Button asChild className="bg-black text-white font-bold uppercase">
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
                className="overflow-hidden border-zinc-200 shadow-sm transition-shadow hover:shadow-md"
              >
                <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-6 py-4">
                  <div className="space-y-1">
                    <CardTitle className="font-mono text-sm font-bold uppercase text-zinc-900">
                      Order #{node.orderNumber}
                    </CardTitle>
                    <CardDescription className="text-xs font-medium uppercase text-zinc-500">
                      Placed on {date}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
                    <Badge
                      variant={
                        node.fulfillmentStatus === "FULFILLED"
                          ? "default" // Black
                          : "secondary" // Grey
                      }
                      className="rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                    >
                      {node.fulfillmentStatus}
                    </Badge>
                    <span className="font-mono text-sm font-bold text-zinc-900">
                      {formatPrice(node.totalPrice.amount)}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-3 overflow-hidden">
                        {node.lineItems.edges.map(
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          ({ node: item }: any, i: number) =>
                            item.variant?.image && (
                              <div
                                key={i}
                                className="relative h-14 w-14 rounded-full border-2 border-white bg-zinc-100 ring-1 ring-zinc-200"
                              >
                                <Image
                                  src={item.variant.image.url}
                                  alt={item.title}
                                  fill
                                  className="object-cover rounded-full"
                                />
                              </div>
                            )
                        )}
                      </div>
                      <div className="text-xs font-medium text-zinc-500">
                        {node.lineItems.edges.length} Item
                        {node.lineItems.edges.length > 1 ? "s" : ""}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      {tracking && (
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-1 text-xs font-bold uppercase text-zinc-500">
                            <Truck className="h-3 w-3" />
                            {carrier || "Courier"}
                          </div>
                          <p className="font-mono text-sm text-zinc-900">
                            {tracking.number}
                          </p>
                        </div>
                      )}

                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-9 border-zinc-300 px-4 text-xs font-bold uppercase tracking-wide hover:bg-zinc-100 hover:text-black"
                      >
                        <a
                          href={node.statusUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          {tracking ? "Track Package" : "View Status"}
                          <ExternalLink className="h-3 w-3" />
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
